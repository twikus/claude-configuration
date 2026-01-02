import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

interface ShellResult {
	stdout: string;
	stderr: string;
	exitCode: number;
}

async function runCommand(command: string): Promise<ShellResult> {
	try {
		const { stdout, stderr } = await execAsync(command);
		return { stdout, stderr, exitCode: 0 };
	} catch (error: unknown) {
		const err = error as { stdout?: string; stderr?: string; code?: number };
		return {
			stdout: err.stdout || "",
			stderr: err.stderr || "",
			exitCode: err.code || 1,
		};
	}
}

export interface GitStatus {
	branch: string;
	hasChanges: boolean;
	staged: {
		added: number;
		deleted: number;
		files: number;
	};
	unstaged: {
		added: number;
		deleted: number;
		files: number;
	};
}

export async function getGitStatus(): Promise<GitStatus> {
	try {
		const isGitRepo = await runCommand("git rev-parse --git-dir");
		if (isGitRepo.exitCode !== 0) {
			return {
				branch: "no-git",
				hasChanges: false,
				staged: { added: 0, deleted: 0, files: 0 },
				unstaged: { added: 0, deleted: 0, files: 0 },
			};
		}

		const branchResult = await runCommand("git branch --show-current");
		const branch = branchResult.stdout.trim() || "detached";

		const diffCheck = await runCommand("git diff-index --quiet HEAD --");
		const cachedCheck = await runCommand("git diff-index --quiet --cached HEAD --");

		if (diffCheck.exitCode !== 0 || cachedCheck.exitCode !== 0) {
			const unstagedDiff = await runCommand("git diff --numstat");
			const stagedDiff = await runCommand("git diff --cached --numstat");
			const stagedFilesResult = await runCommand("git diff --cached --name-only");
			const unstagedFilesResult = await runCommand("git diff --name-only");

			const parseStats = (diff: string) => {
				let added = 0;
				let deleted = 0;
				for (const line of diff.split("\n")) {
					if (!line.trim()) continue;
					const [a, d] = line
						.split("\t")
						.map((n) => Number.parseInt(n, 10) || 0);
					added += a;
					deleted += d;
				}
				return { added, deleted };
			};

			const unstagedStats = parseStats(unstagedDiff.stdout);
			const stagedStats = parseStats(stagedDiff.stdout);

			const stagedFilesCount = stagedFilesResult.stdout
				.split("\n")
				.filter((f) => f.trim()).length;
			const unstagedFilesCount = unstagedFilesResult.stdout
				.split("\n")
				.filter((f) => f.trim()).length;

			return {
				branch,
				hasChanges: true,
				staged: {
					added: stagedStats.added,
					deleted: stagedStats.deleted,
					files: stagedFilesCount,
				},
				unstaged: {
					added: unstagedStats.added,
					deleted: unstagedStats.deleted,
					files: unstagedFilesCount,
				},
			};
		}

		return {
			branch,
			hasChanges: false,
			staged: { added: 0, deleted: 0, files: 0 },
			unstaged: { added: 0, deleted: 0, files: 0 },
		};
	} catch {
		return {
			branch: "no-git",
			hasChanges: false,
			staged: { added: 0, deleted: 0, files: 0 },
			unstaged: { added: 0, deleted: 0, files: 0 },
		};
	}
}

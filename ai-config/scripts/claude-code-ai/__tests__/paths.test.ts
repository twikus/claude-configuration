import { describe, expect, it } from "bun:test";
import { homedir } from "node:os";
import { join, sep } from "node:path";
import {
	encodeProjectPath,
	getClaudeConfigDir,
	getClaudeCredentialsPath,
	getClaudeProjectsDir,
	getHomeDir,
} from "../helper/paths";

describe("getHomeDir", () => {
	it("should return a non-empty string", () => {
		const home = getHomeDir();
		expect(home).toBeTruthy();
		expect(typeof home).toBe("string");
	});

	it("should match os.homedir()", () => {
		expect(getHomeDir()).toBe(homedir());
	});
});

describe("getClaudeCredentialsPath", () => {
	it("should return path in home directory", () => {
		const credPath = getClaudeCredentialsPath();
		expect(credPath).toContain(getHomeDir());
		expect(credPath).toContain(".credentials.json");
	});
});

describe("getClaudeProjectsDir", () => {
	it("should return path with projects directory", () => {
		const projectsDir = getClaudeProjectsDir();
		expect(projectsDir).toContain("projects");
	});
});

describe("encodeProjectPath", () => {
	it("should encode forward slashes to dashes", () => {
		const result = encodeProjectPath("/Users/test/myproject");
		expect(result).toContain("-Users-test-myproject");
	});

	it("should encode dots to dashes", () => {
		const result = encodeProjectPath("/path/to/.hidden");
		expect(result).toContain("-hidden");
	});

	it("should handle Windows paths", () => {
		const result = encodeProjectPath("C:\\Users\\test\\project");
		expect(result).not.toContain("\\");
		expect(result).not.toContain(":");
	});

	it("should return path as-is if already in projects directory", () => {
		const home = getHomeDir();
		const existingPath = join(home, ".claude", "projects", "my-project");
		const result = encodeProjectPath(existingPath);
		expect(result).toBe(existingPath);
	});

	it("should strip trailing slashes", () => {
		const path1 = encodeProjectPath("/Users/test/project/");
		const path2 = encodeProjectPath("/Users/test/project");
		expect(path1).toBe(path2);
	});
});

#!/usr/bin/env bun
// @bun

// src/cli.ts
import { join } from "path";

// src/lib/security-rules.ts
var SECURITY_RULES = {
  CRITICAL_COMMANDS: [
    "del",
    "format",
    "mkfs",
    "shred",
    "dd",
    "fdisk",
    "parted",
    "gparted",
    "cfdisk"
  ],
  PRIVILEGE_COMMANDS: [
    "sudo",
    "su",
    "passwd",
    "chpasswd",
    "usermod",
    "chmod",
    "chown",
    "chgrp",
    "setuid",
    "setgid"
  ],
  NETWORK_COMMANDS: [
    "nc",
    "netcat",
    "nmap",
    "telnet",
    "ssh-keygen",
    "iptables",
    "ufw",
    "firewall-cmd",
    "ipfw"
  ],
  SYSTEM_COMMANDS: [
    "systemctl",
    "service",
    "kill",
    "killall",
    "pkill",
    "mount",
    "umount",
    "swapon",
    "swapoff"
  ],
  DANGEROUS_PATTERNS: [
    /rm\s+.*-rf\s*\/\s*$/i,
    /rm\s+.*-rf\s*\/etc/i,
    /rm\s+.*-rf\s*\/usr/i,
    /rm\s+.*-rf\s*\/bin/i,
    /rm\s+.*-rf\s*\/sys/i,
    /rm\s+.*-rf\s*\/proc/i,
    /rm\s+.*-rf\s*\/boot/i,
    /rm\s+.*-rf\s*\/home\/[^/]*\s*$/i,
    /rm\s+.*-rf\s*\.\.+\//i,
    /rm\s+.*-rf\s*\*.*\*/i,
    /rm\s+.*-rf\s*\$\w+/i,
    />\s*\/dev\/(sda|hda|nvme)/i,
    /dd\s+.*of=\/dev\//i,
    /shred\s+.*\/dev\//i,
    /mkfs\.\w+\s+\/dev\//i,
    /:\(\)\{\s*:\|:&\s*\};:/,
    /while\s+true\s*;\s*do.*done/i,
    /for\s*\(\(\s*;\s*;\s*\)\)/i,
    /\|\s*(sh|bash|zsh|fish)$/i,
    /(wget|curl)\s+.*\|\s*(sh|bash)/i,
    /(wget|curl)\s+.*-O-.*\|\s*(sh|bash)/i,
    /`.*rm.*`/i,
    /\$\(.*rm.*\)/i,
    /`.*dd.*`/i,
    /\$\(.*dd.*\)/i,
    /cat\s+\/etc\/(passwd|shadow|sudoers)/i,
    />\s*\/etc\/(passwd|shadow|sudoers)/i,
    /echo\s+.*>>\s*\/etc\/(passwd|shadow|sudoers)/i,
    /\|\s*nc\s+\S+\s+\d+/i,
    /curl\s+.*-d.*\$\(/i,
    /wget\s+.*--post-data.*\$\(/i,
    />\s*\/var\/log\//i,
    /rm\s+\/var\/log\//i,
    /echo\s+.*>\s*~?\/?\.bash_history/i,
    /nc\s+.*-l.*-e/i,
    /nc\s+.*-e.*-l/i,
    /ncat\s+.*--exec/i,
    /ssh-keygen.*authorized_keys/i,
    /(wget|curl).*\.(sh|py|pl|exe|bin).*\|\s*(sh|bash|python)/i,
    /(xmrig|ccminer|cgminer|bfgminer)/i,
    /cat\s+\/dev\/(mem|kmem)/i,
    /echo\s+.*>\s*\/dev\/(mem|kmem)/i,
    /(insmod|rmmod|modprobe)\s+/i,
    /crontab\s+-e/i,
    /echo\s+.*>>\s*\/var\/spool\/cron/i,
    /env\s*\|\s*grep.*PASSWORD/i,
    /printenv.*PASSWORD/i,
    /docker\s+(rm|rmi|kill|stop)\s+.*\$\(/i,
    /docker\s+system\s+prune.*-a/i,
    /docker\s+container\s+prune.*-f/i,
    /docker\s+volume\s+rm.*\$\(/i,
    /docker\s+network\s+rm.*\$\(/i,
    /prisma\s+(migrate\s+reset|db\s+push\s+--force-reset)/i
  ],
  PROTECTED_PATHS: [
    "/etc/",
    "/usr/",
    "/sbin/",
    "/boot/",
    "/sys/",
    "/proc/",
    "/dev/",
    "/root/"
  ],
  SAFE_EXECUTABLE_PATHS: [
    "/Applications/",
    "/usr/local/bin/",
    "/usr/bin/",
    "/bin/",
    "/opt/"
  ],
  SAFE_RM_PATHS: [
    "/Users/melvynx/Developer/",
    "/tmp/",
    "/var/tmp/",
    `${process.cwd()}/`
  ]
};
var SAFE_COMMANDS = [
  "ls",
  "dir",
  "pwd",
  "whoami",
  "date",
  "echo",
  "cat",
  "head",
  "tail",
  "grep",
  "find",
  "wc",
  "sort",
  "uniq",
  "cut",
  "awk",
  "sed",
  "git",
  "npm",
  "pnpm",
  "node",
  "bun",
  "python",
  "pip",
  "source",
  "cd",
  "cp",
  "mv",
  "mkdir",
  "touch",
  "ln",
  "psql",
  "mysql",
  "sqlite3",
  "mongo"
];

// src/lib/validator.ts
class CommandValidator {
  validate(command, toolName = "Unknown") {
    const result = {
      isValid: true,
      severity: "LOW",
      violations: [],
      sanitizedCommand: command
    };
    if (!command || typeof command !== "string") {
      result.isValid = false;
      result.violations.push("Invalid command format");
      return result;
    }
    if (command.length > 2000) {
      result.isValid = false;
      result.severity = "MEDIUM";
      result.violations.push("Command too long (potential buffer overflow)");
      return result;
    }
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/.test(command)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push("Binary or encoded content detected");
      return result;
    }
    const normalizedCmd = command.trim().toLowerCase();
    const cmdParts = normalizedCmd.split(/\s+/);
    const mainCommand = cmdParts[0].split("/").pop() || "";
    if (mainCommand === "source" || mainCommand === "python") {
      return result;
    }
    for (const pattern of SECURITY_RULES.DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        result.isValid = false;
        result.severity = "CRITICAL";
        result.violations.push(`Dangerous pattern detected: ${pattern.source}`);
      }
    }
    if (SECURITY_RULES.CRITICAL_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "CRITICAL";
      result.violations.push(`Critical dangerous command: ${mainCommand}`);
    }
    if (SECURITY_RULES.PRIVILEGE_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`Privilege escalation command: ${mainCommand}`);
    }
    if (SECURITY_RULES.NETWORK_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`Network/remote access command: ${mainCommand}`);
    }
    if (SECURITY_RULES.SYSTEM_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`System manipulation command: ${mainCommand}`);
    }
    if (/rm\s+.*-rf\s/.test(command)) {
      const isRmRfSafe = this.isRmRfCommandSafe(command);
      if (!isRmRfSafe) {
        result.isValid = false;
        result.severity = "CRITICAL";
        result.violations.push("rm -rf command targeting unsafe path");
      }
    }
    if (SAFE_COMMANDS.includes(mainCommand) && result.violations.length === 0) {
      return result;
    }
    if (command.includes("&&")) {
      const chainedCommands = this.splitCommandChain(command);
      let allSafe = true;
      for (const chainedCmd of chainedCommands) {
        const trimmedCmd = chainedCmd.trim();
        const cmdParts2 = trimmedCmd.split(/\s+/);
        const mainCommand2 = cmdParts2[0];
        if (mainCommand2 === "source" || mainCommand2 === "python" || SAFE_COMMANDS.includes(mainCommand2)) {
          continue;
        }
        const chainResult = this.validateSingleCommand(trimmedCmd, toolName);
        if (!chainResult.isValid) {
          result.isValid = false;
          result.severity = chainResult.severity;
          result.violations.push(`Chained command violation: ${trimmedCmd} - ${chainResult.violations.join(", ")}`);
          allSafe = false;
        }
      }
      if (allSafe) {
        return result;
      }
    }
    if (command.includes(";") || command.includes("||")) {
      const chainedCommands = this.splitCommandChain(command);
      for (const chainedCmd of chainedCommands) {
        const chainResult = this.validateSingleCommand(chainedCmd.trim(), toolName);
        if (!chainResult.isValid) {
          result.isValid = false;
          result.severity = chainResult.severity;
          result.violations.push(`Chained command violation: ${chainedCmd.trim()} - ${chainResult.violations.join(", ")}`);
        }
      }
      return result;
    }
    for (const path of SECURITY_RULES.PROTECTED_PATHS) {
      if (command.includes(path)) {
        if (path === "/dev/" && (command.includes("/dev/null") || command.includes("/dev/stderr") || command.includes("/dev/stdout"))) {
          continue;
        }
        const cmdStart = command.trim();
        let isSafeExecutable = false;
        for (const safePath of SECURITY_RULES.SAFE_EXECUTABLE_PATHS) {
          if (cmdStart.startsWith(safePath)) {
            isSafeExecutable = true;
            break;
          }
        }
        const pathIndex = command.indexOf(path);
        const beforePath = command.substring(0, pathIndex);
        const redirectBeforePath = />\s*$/.test(beforePath.trim());
        if (!isSafeExecutable && redirectBeforePath) {
          result.isValid = false;
          result.severity = "HIGH";
          result.violations.push(`Dangerous operation on protected path: ${path}`);
        }
      }
    }
    return result;
  }
  validateSingleCommand(command, _toolName = "Unknown") {
    const result = {
      isValid: true,
      severity: "LOW",
      violations: [],
      sanitizedCommand: command
    };
    if (!command || typeof command !== "string") {
      result.isValid = false;
      result.violations.push("Invalid command format");
      return result;
    }
    if (command.length > 2000) {
      result.isValid = false;
      result.severity = "MEDIUM";
      result.violations.push("Command too long (potential buffer overflow)");
      return result;
    }
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/.test(command)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push("Binary or encoded content detected");
      return result;
    }
    const normalizedCmd = command.trim().toLowerCase();
    const cmdParts = normalizedCmd.split(/\s+/);
    const mainCommand = cmdParts[0].split("/").pop() || "";
    if (mainCommand === "source" || mainCommand === "python") {
      return result;
    }
    for (const pattern of SECURITY_RULES.DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        result.isValid = false;
        result.severity = "CRITICAL";
        result.violations.push(`Dangerous pattern detected: ${pattern.source}`);
      }
    }
    if (SECURITY_RULES.CRITICAL_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "CRITICAL";
      result.violations.push(`Critical dangerous command: ${mainCommand}`);
    }
    if (SECURITY_RULES.PRIVILEGE_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`Privilege escalation command: ${mainCommand}`);
    }
    if (SECURITY_RULES.NETWORK_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`Network/remote access command: ${mainCommand}`);
    }
    if (SECURITY_RULES.SYSTEM_COMMANDS.includes(mainCommand)) {
      result.isValid = false;
      result.severity = "HIGH";
      result.violations.push(`System manipulation command: ${mainCommand}`);
    }
    if (/rm\s+.*-rf\s/.test(command)) {
      const isRmRfSafe = this.isRmRfCommandSafe(command);
      if (!isRmRfSafe) {
        result.isValid = false;
        result.severity = "CRITICAL";
        result.violations.push("rm -rf command targeting unsafe path");
      }
    }
    if (SAFE_COMMANDS.includes(mainCommand) && result.violations.length === 0) {
      return result;
    }
    for (const path of SECURITY_RULES.PROTECTED_PATHS) {
      if (command.includes(path)) {
        if (path === "/dev/" && (command.includes("/dev/null") || command.includes("/dev/stderr") || command.includes("/dev/stdout"))) {
          continue;
        }
        const cmdStart = command.trim();
        let isSafeExecutable = false;
        for (const safePath of SECURITY_RULES.SAFE_EXECUTABLE_PATHS) {
          if (cmdStart.startsWith(safePath)) {
            isSafeExecutable = true;
            break;
          }
        }
        const pathIndex = command.indexOf(path);
        const beforePath = command.substring(0, pathIndex);
        const redirectBeforePath = />\s*$/.test(beforePath.trim());
        if (!isSafeExecutable && redirectBeforePath) {
          result.isValid = false;
          result.severity = "HIGH";
          result.violations.push(`Dangerous operation on protected path: ${path}`);
        }
      }
    }
    return result;
  }
  splitCommandChain(command) {
    const commands = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    for (let i = 0;i < command.length; i++) {
      const char = command[i];
      const nextChar = command[i + 1];
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
        current += char;
      } else if (inQuotes) {
        current += char;
      } else if (char === "&" && nextChar === "&") {
        commands.push(current.trim());
        current = "";
        i++;
      } else if (char === "|" && nextChar === "|") {
        commands.push(current.trim());
        current = "";
        i++;
      } else if (char === ";") {
        commands.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      commands.push(current.trim());
    }
    return commands.filter((cmd) => cmd.length > 0);
  }
  isRmRfCommandSafe(command) {
    const rmRfMatch = command.match(/rm\s+.*-rf\s+([^\s;&|]+)/);
    if (!rmRfMatch) {
      return false;
    }
    const targetPath = rmRfMatch[1];
    if (targetPath === "/" || targetPath.endsWith("/")) {
      return false;
    }
    for (const safePath of SECURITY_RULES.SAFE_RM_PATHS) {
      if (targetPath.startsWith(safePath)) {
        return true;
      }
    }
    if (!targetPath.startsWith("/")) {
      return true;
    }
    return false;
  }
}

// src/cli.ts
var LOG_FILE = join(import.meta.dir, "../data/security.log");
async function logSecurityEvent(command, toolName, result, sessionId) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    sessionId,
    toolName,
    command: command.substring(0, 500),
    blocked: !result.isValid,
    severity: result.severity,
    violations: result.violations,
    source: "claude-code-hook"
  };
  try {
    const logLine = `${JSON.stringify(logEntry)}
`;
    const file = Bun.file(LOG_FILE);
    const exists = await file.exists();
    if (exists) {
      const existingContent = await file.text();
      await Bun.write(LOG_FILE, existingContent + logLine);
    } else {
      await Bun.write(LOG_FILE, logLine);
    }
    console.error(`[SECURITY] ${result.isValid ? "ALLOWED" : "BLOCKED"}: ${command.substring(0, 100)}`);
  } catch (error) {
    console.error("Failed to write security log:", error);
  }
}
async function main() {
  const validator = new CommandValidator;
  try {
    const stdin = process.stdin;
    const chunks = [];
    for await (const chunk of stdin) {
      chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString();
    if (!input.trim()) {
      console.error("No input received from stdin");
      process.exit(1);
    }
    let hookData;
    try {
      hookData = JSON.parse(input);
    } catch (error) {
      console.error("Invalid JSON input:", error.message);
      process.exit(1);
    }
    const toolName = hookData.tool_name || "Unknown";
    const toolInput = hookData.tool_input || {};
    const sessionId = hookData.session_id || null;
    if (toolName !== "Bash") {
      console.log(`Skipping validation for tool: ${toolName}`);
      process.exit(0);
    }
    const command = toolInput.command;
    if (!command) {
      console.error("No command found in tool input");
      process.exit(1);
    }
    const result = validator.validate(command, toolName);
    await logSecurityEvent(command, toolName, result, sessionId);
    if (result.isValid) {
      console.log("Command validation passed");
      process.exit(0);
    }
    const confirmationMessage = `\u26A0\uFE0F  Potentially dangerous command detected!

Command: ${command}
Violations: ${result.violations.join(", ")}
Severity: ${result.severity}

Do you want to proceed with this command?`;
    const hookOutput = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: confirmationMessage
      }
    };
    console.log(JSON.stringify(hookOutput));
    process.exit(0);
  } catch (error) {
    console.error("Validation script error:", error);
    process.exit(2);
  }
}
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(2);
});

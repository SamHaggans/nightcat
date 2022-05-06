const { spawn } = require("child_process");
const ld = require("lodash");
const colors = require("colors");
const { isEmpty } = require("lodash");

// Time to wait on initialization of SSH connection
const DELAY = 1000;

class SSHProcess {
    constructor(remote, process) {
        this.remote = remote;
        this.process = process;
    }
    init() {
        return new Promise((resolve) => {
            this.ssh = spawn("ssh", ["-tt", this.remote]);
            this.ssh.on;
            this.ssh.stdout.on("data", (data) => {
                this.parseInput(data, `REMOTE [${this.remote}]`.blue);
            });

            this.ssh.stderr.on("data", (data) => {
                this.parseInput(data, `REMOTE [${this.remote}]`.yellow);
            });
            this.ssh.on("close", (code) => {
                const exitColor = code == 0 ? colors.cyan : colors.red;
                const statusText = code == 0 ? "successfully" : "with errors";
                this.process.stdout.write(
                    exitColor(
                        `REMOTE [${this.remote}] exited ${statusText} (code ${code})\r\n`,
                    ),
                );
                this.quitCallback(code == 0);
            });
            setTimeout(resolve, DELAY);
        });
    }
    parseInput(data, lineHeader) {
        data = data
            .toString()
            .replaceAll("\r", "")
            .replaceAll(" || exit 1", "");
        data = data.split("\n");
        data = ld.map(data, (line) => `${lineHeader}\t ${line}\r\n`);
        data = ld.filter(
            data,
            (line) =>
                !isEmpty(
                    line
                        .replaceAll("\n", "")
                        .replaceAll("\r", "")
                        .replaceAll(" ", ""),
                ),
        );
        data = ld.join(data, "");
        this.process.stdout.write(data);
        return data;
    }
    exec(data, exitOnError = true) {
        if (exitOnError) {
            this.ssh.stdin.write(`${data} || exit 1\r\n`);
        } else {
            this.ssh.stdin.write(`${data}\r\n`);
        }
    }
    finish() {
        return new Promise((resolve) => {
            this.exec("exit 0", false);
            this.quitCallback = (success) => resolve(success);
        });
    }
}

module.exports = { SSHProcess };

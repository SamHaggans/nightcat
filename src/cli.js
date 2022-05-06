//const { spawn } = require("child_process");
//const readline = require("readline");
const parser = require("./parse");
//const { SSHProcess } = require("./client/ssh");

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});*/

async function main() {
    const command = parser.parse(process.argv);
    console.log(command);
    process.exit();
}

module.exports = { main };

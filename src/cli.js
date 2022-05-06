//const { spawn } = require("child_process");
const readline = require("readline");
const parser = require("./parse");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {
    rl.question("What is your name? ", (name) => {
        console.log(`Hello from Nightcat, ${name}!`);
        console.log(`Nightcat was called with the following arguments: \r\n${parser.parse(process.argv)}`);
    });
};

module.exports = { main };

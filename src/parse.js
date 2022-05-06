const minimist = require("minimist");
const ld = require("lodash");

/*
 * General arguments parser, wrapper for minimist with some specific changes
 */
function parse(argv) {
    const args = minimist(argv);
    // Filter out node
    // Get rid of any paths if they are part of the arguments
    let filteredArgs = ld.map(argv, arg => arg.split("/").slice(-1));
    // Remove node from the list (since it may or may not be present)
    ld.remove(filteredArgs, arg => arg == "node");
    return filteredArgs;
}

module.exports = { parse };

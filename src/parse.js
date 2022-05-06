const minimist = require("minimist");
const ld = require("lodash");

/*
 * General arguments parser, wrapper for minimist with some specific changes
 */
function parse(argv) {
    const minArgs = minimist(argv);
    // Get rid of any paths if they are part of the arguments
    const filteredArgs = ld.map(
        minArgs._,
        (arg) => arg.split("/").slice(-1)[0],
    );
    // Remove node from the list (since it may or may not be present and we want indexing to be the same either way)
    ld.remove(filteredArgs, (arg) => arg == "node");

    // Primary command is the first argument that isn't node or the process name
    // The args are the rest of the non-flagged arguments
    // Flags are just the minimist flags
    return {
        primaryCommand: filteredArgs[1] || null,
        args: filteredArgs.slice(2),
        flags: ld.omit(minArgs, "_"),
    };
}

module.exports = { parse };

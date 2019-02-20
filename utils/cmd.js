const spawn = require('child_process').spawn;
const concat = require('concat-stream');
const { existsSync } = require('fs');
const { constants } = require('os');
const PATH = process.env.PATH;

/**
 * Creates a child process with script path
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Object} env (optional) Environment variables
 */
function createProcess(processPath, args = [], env = null) {
    // Ensure that path exists
    if (!processPath || !existsSync(processPath)) {
        throw new Error('Invalid process path');
    }

    args = [processPath].concat(args);

    // This works for node based CLIs, but can easily be adjusted to
    // any other process installed in the system
    return spawn('node', args, {
        env: Object.assign(
            {
                NODE_ENV: 'test',
                preventAutoStart: false,
                PATH // This is needed in order to get all the binaries in your current terminal
            },
            env
        )
    });
}

const execute = (processPath, args = [], opts = {}) => {
    const {env = null} = opts;
    const childProcess = createProcess(processPath, args, env);
    childProcess.stdin.setEncoding('utf-8');

    return new Promise((resolve, reject) => {
        childProcess.stderr.once('data', err => {
            reject(err.toString());
        });
        childProcess.on('error', reject);
        childProcess.stdout.pipe(
            concat(result => {
                resolve(result.toString());
            })
        );
    });
};

module.exports = {
    execute
};
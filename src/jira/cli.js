#!/usr/bin/env node

const yargs = require('yargs');
const openUrl = require("openurl");
const os = require('os');
const path = require('path');
const fs = require('fs');

const argv = yargs.argv;
const jiraTicket = argv['$0'];
const homedir = os.homedir();
const configPath = path.resolve(homedir, '.jira/config.json');
let config = null;


if (fs.existsSync(configPath)) {
    config = require(configPath);

    const jiraUrl = config.host + `/browse/${jiraTicket}`;
    openUrl.open(jiraUrl);
} else {
    throw new Error("Jira config file not found: " + configPath);
}
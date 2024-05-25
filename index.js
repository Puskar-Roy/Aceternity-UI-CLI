#! /usr/bin/env node
const { program } = require("commander");
const init = require("./commands/init");
const configure = require("./commands/config");
const add = require("./commands/add");
program
  .command("init")
  .description("Initialize project with necessary packages and files")
  .action(init);

program
  .command("configure")
  .description("Configure paths for cn.ts and tailwind.config.js")
  .action(configure);

program
  .command("add <component>")
  .description("Add a new component to your project")
  .action(add);

program.parse(process.argv);

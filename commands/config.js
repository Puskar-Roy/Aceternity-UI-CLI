#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");

async function configure() {
  const questions = [
    {
      type: "input",
      name: "componentsPath",
      message: "Where do you want to store components?",
      initial: "components/ui",
    },
    {
      type: "input",
      name: "cnPath",
      message: "Where do you want to create cn.ts?",
      initial: "utils/cn.ts",
    },
    {
      type: "input",
      name: "tailwindConfigPath",
      message: "Where is your tailwind.config.js located?",
      initial: "tailwind.config.js",
    },
  ];

  try {
    const answers = await prompt(questions);
    const configPath = path.join(process.cwd(), "aceternity.json");

    // Write configuration to aceternity.json
    fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
    console.log("Configuration saved to aceternity.json");
  } catch (error) {
    console.error("Error during configuration:", error);
  }
}

module.exports = configure;

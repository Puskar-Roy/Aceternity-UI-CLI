const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");

async function init() {
  let config;
  const configPath = path.join(process.cwd(), "aceternity.json");
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } else {
    console.log("Configuration file not found. Creating a new one...");
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

    const answers = await prompt(questions);

    fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
    console.log("Configuration saved to aceternity.json");

    config = answers;
  }

  const { cnPath, tailwindConfigPath } = config;

  console.log("Installing framer-motion, clsx, and tailwind-merge...");
  execSync("npm install framer-motion clsx tailwind-merge", {
    stdio: "inherit",
  });

  const cnTemplatePath = path.join(__dirname, "..", "templates", "cn.ts");
  const cnDestinationPath = path.join(process.cwd(), cnPath);
  const cnDir = path.dirname(cnDestinationPath);

  if (!fs.existsSync(cnDir)) {
    fs.mkdirSync(cnDir, { recursive: true });
  }

  fs.copyFileSync(cnTemplatePath, cnDestinationPath);
  console.log(`Created ${cnPath} with the specified content.`);

  const tailwindConfigTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    "tailwind.config.js"
  );
  const tailwindConfigDestinationPath = path.join(
    process.cwd(),
    tailwindConfigPath
  );

  fs.copyFileSync(tailwindConfigTemplatePath, tailwindConfigDestinationPath);
  console.log(`Replaced ${tailwindConfigPath} with the specified content.`);
}

module.exports = init;

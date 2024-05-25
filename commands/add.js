#! /usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { defaultTailwindConfig } = require("../configs/config");

const componentsConfig = require("../componentsConfig.json");

function add(componentName) {
  const componentConfig = componentsConfig[componentName];
  if (!componentConfig) {
    console.error(`Component configuration for ${componentName} not found.`);
    process.exit(1);
  }

  const { dependencies, templatePath } = componentConfig;

  if (!fs.existsSync(templatePath)) {
    console.error(`Component template for ${componentName} not found.`);
    process.exit(1);
  }
  const configPath = path.join(process.cwd(), "aceternity.json");
  if (!fs.existsSync(configPath)) {
    console.error(
      "Configuration file not found. Please run `aceternity configure` first."
    );
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const { tailwindConfigPath, componentsPath = "components/ui" } = config;

  console.log(`Installing dependencies for ${componentName}...`);
  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" });

  if (fs.existsSync(tailwindConfigPath)) {
    const currentConfig = fs.readFileSync(tailwindConfigPath, "utf-8");
    if (currentConfig !== defaultTailwindConfig) {
      console.log("Merging tailwind.config.js...");
      fs.writeFileSync(tailwindConfigPath, defaultTailwindConfig);
    }
  } else {
    fs.writeFileSync(tailwindConfigPath, defaultTailwindConfig);
  }

  const componentDestinationDir = path.join(process.cwd(), componentsPath);
  if (!fs.existsSync(componentDestinationDir)) {
    fs.mkdirSync(componentDestinationDir, { recursive: true });
  }
  const componentDestinationPath = path.join(
    componentDestinationDir,
    `${componentName}.tsx`
  );
  fs.copyFileSync(templatePath, componentDestinationPath);
  console.log(`Copied ${componentName}.tsx to ${componentDestinationDir}.`);

  config.components = config.components || {};
  config.components[componentName] = componentDestinationPath;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Updated aceternity.json with ${componentName} component.`);
}

module.exports = add;

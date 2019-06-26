#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const yaml = require('js-yaml')

async function create () {
  const resp = await inquirer.prompt([
  {
    type: 'input',
    name: 'title',
  }, {
    type: 'input',
    name: 'id',
    default: ({ title }) => title.split(' ').join('').toLowerCase(),
  }, {
    type: 'input',
    name: 'providers',
  }])

  const destPath = path.resolve(__dirname, '../cards', resp.id)

  const exists = await fs.pathExists(destPath)
  if (exists) {
    throw new Error('Path already exists')
  }

  // Copy the the template
  const templatePath = path.resolve(__dirname, '../template')
  await fs.copy(templatePath, destPath)

  // Add server package.json
  await fs.outputJson(path.resolve(destPath, './server/package.json'), {
    name: `${resp.id}-server`,
    version: "0.0.1",
    main: "index.js",
  }, { spaces: 2 })

  // Add component package.json
  await fs.outputJson(path.resolve(destPath, './component/package.json'), {
    name: `${resp.id}-component`,
    version: "0.0.1",
    main: "index.js",
  }, { spaces: 2 })

  // Add snapboard yaml
  const ymlStr = yaml.safeDump({
    id: resp.id,
    title: resp.title,
    providers: resp.providers.split(' '),
    inputs: {},
  })
  await fs.outputFile(path.resolve(destPath, './snapboard.yml'), ymlStr)
}

if (require.main === module) {
  create()
}

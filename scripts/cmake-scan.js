#!/usr/bin/env node

const { execFileSync } = require('child_process')
const path = require('path')
const yaml = require('yaml')
const fs = require('fs')

const args = process.argv.slice(2)
const ruleDirSeparatorIndex = args.indexOf('--rule-dirs')
const utilDirSeparatorIndex = args.indexOf('--util-dirs')
const astGrepSeparatorIndex = args.indexOf('--')

// Extract rule directories (required)
let ruleDirs = []
if (ruleDirSeparatorIndex !== -1) {
	const nextSeparator = [utilDirSeparatorIndex, astGrepSeparatorIndex]
		.filter(idx => idx > ruleDirSeparatorIndex)
		.sort((a, b) => a - b)[0] || args.length
	ruleDirs = args.slice(ruleDirSeparatorIndex + 1, nextSeparator)
} else {
	console.error('Error: At least one rule directory must be specified with --rule-dirs')
	process.exit(1)

}

// Extract utility directories (optional)
let utilDirs = []
if (utilDirSeparatorIndex !== -1) {
	const nextSeparator = [ruleDirSeparatorIndex, astGrepSeparatorIndex]
		.filter(idx => idx > utilDirSeparatorIndex)
		.sort((a, b) => a - b)[0] || args.length
	utilDirs = args.slice(utilDirSeparatorIndex + 1, nextSeparator)
}

// Extract ast-grep arguments
const astGrepArgs = astGrepSeparatorIndex !== -1
	? args.slice(astGrepSeparatorIndex + 1)
	: []

// Path to the internal config file in the installed hook
const configPath = path.join(process.env['NODE_PATH'], 'ast-grep-cmake-precommit', 'sgconfig.yml')

// Read or create config
let config = {}
try {
	const configFile = fs.readFileSync(configPath, 'utf8')
	config = yaml.parse(configFile) || {}
} catch (error) {
	console.error('Error reading YAML file:', error)
	process.exit(1)
}


const base_config = JSON.parse(JSON.stringify(config))

// Clear existing dirs
config.ruleDirs = []
config.utilDirs = []
config.testConfigs = []

for (const dir of ruleDirs) {
	const absolutePath = path.resolve(dir)
	if (!config.ruleDirs.includes(absolutePath)) {
		config.ruleDirs.push(absolutePath)
	}
}

for (const dir of utilDirs) {
	const absolutePath = path.resolve(dir)
	if (!config.utilDirs.includes(absolutePath)) {
		config.utilDirs.push(absolutePath)
	}
}

try {
	fs.writeFileSync(configPath, yaml.stringify(config))
} catch (error) {
	console.error('Error writing config file:', error)
	process.exit(1)
}

let exit_code = 0
let final_args = ['scan', '-c', configPath].concat(astGrepArgs)

try {
	execFileSync('ast-grep', final_args, { stdio: 'inherit', encoding: 'utf8' })
} catch (error) {
	exit_code = 1
}

// Restore base config so different pre-commit users (repos) don't interfere with each other
try {
	fs.writeFileSync(configPath, yaml.stringify(base_config))
} catch (restoreError) {
	console.error('Error restoring original config file:', restoreError)
}
process.exit(exit_code)
process.exit(exit_code)

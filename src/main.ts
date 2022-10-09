import * as path from "node:path"

import * as core from "@actions/core"
import * as exec from "@actions/exec"

import { loadConfig } from "./config"
import { searchPaths } from "./search"

const run = async () => {
  const configPath = core.getInput("config_path")
  const config = await loadConfig(configPath)

  const executionPaths: string[] = []
  for await (const p of searchPaths(config)) {
    executionPaths.push(p)

    let stdout = ""

    const options: exec.ExecOptions = {
      listeners: {
        stdout: (data) => {
          stdout += data.toString()
        },
      },
      cwd: path.dirname(p),
      silent: true,
    }

    await exec.exec("tree", ["--noreport", "."], options)

    stdout
  }

  core.info(`Execution paths: \n${executionPaths.join("\n")}`)
}

const main = async () => {
  try {
    await run()
  } catch (e) {
    console.error(e)
    if (e instanceof Error) {
      core.setFailed(e.message)
    } else {
      core.setFailed("Error. Please check the action logs.")
    }
  }
}

void main()

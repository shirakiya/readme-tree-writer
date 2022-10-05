import * as path from "node:path"

import * as core from "@actions/core"
import * as exec from "@actions/exec"

import { loadConfig } from "./config"
import { searchDirs } from "./search"

const run = async () => {
  const configPath = core.getInput("config_path")
  const config = await loadConfig(configPath)

  for await (const dir of searchDirs(config)) {
    let stdout = ""

    const options: exec.ExecOptions = {
      listeners: {
        stdout: (data) => {
          stdout += data.toString()
        },
      },
      cwd: path.dirname(dir),
    }

    await exec.exec("tree", ["--noreport", "."], options)

    console.log("stdout: ", stdout)
  }
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

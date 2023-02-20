import * as path from "node:path"

import * as core from "@actions/core"
import * as exec from "@actions/exec"

import { loadConfig } from "./config"
import { replaceTreeOutput } from "./replace"
import { searchPaths } from "./search"
import { TreeWriter } from "./writer"

const run = async () => {
  const configPath = core.getInput("config_path")
  const config = await loadConfig(configPath)

  core.info(`Run with the following config\n${JSON.stringify(config)}\n`)

  const writer = new TreeWriter({
    chapter: config.chapter,
  })

  for await (const p of searchPaths(config)) {
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
    await exec.exec("tree", ["--noreport", "-v", "."], options)

    const treeResult = replaceTreeOutput(stdout)

    const result = await writer.write({
      path: p,
      tree: treeResult,
    })
    if (result) {
      core.info(`Wrote tree to "${p}"`)
    }
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

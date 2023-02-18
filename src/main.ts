import * as path from "node:path"

import * as core from "@actions/core"
import * as exec from "@actions/exec"

import { loadConfig } from "./config"
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

    // XXX: The raw output of `tree` includes "no-break-space" character.
    // no-break-space appears only in GitHub Actions host as far as I know.
    // I assume that developers write the output of tree command in local machine,
    // and they run this action. If this action writes the output of tree command
    // with no-break-space, there will always be a difference. To avoid this,
    // replace no-break-space to normal space(\u{0020}).
    const treeOutput = stdout.replace(/[\u00A0]/g, " ")

    const result = await writer.write({
      path: p,
      tree: treeOutput,
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

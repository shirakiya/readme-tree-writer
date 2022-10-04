import * as core from "@actions/core"

import { loadConfig } from "./config"

const run = async () => {
  const configPath = core.getInput("config_path")
  const config = await loadConfig(configPath)

  console.log("config:", config)
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

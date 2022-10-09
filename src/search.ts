import * as path from "node:path"

import * as glob from "@actions/glob"

import type { ConfigType } from "./config"

const createGlobPatterns = (
  fileNames: string[],
  include: string[],
  exclude: string[],
): string[] => {
  let includePatterns: string[]
  if (include.length === 0) {
    includePatterns = fileNames.map((fileName) => path.join("**", fileName))
  } else {
    includePatterns = include
      .map((dir) => {
        return fileNames.map((fileName) => path.join(dir, "**", fileName))
      })
      .flat()
  }

  const excludePatterns = exclude
    .map((dir) => {
      return fileNames.map((fileName) => path.join(`!${dir}`, "**", fileName))
    })
    .flat()

  return includePatterns.concat(excludePatterns)
}

export async function* searchPaths(config: ConfigType): AsyncGenerator<string> {
  const globPatterns = createGlobPatterns(
    config.fileNames,
    config.include,
    config.exclude,
  )

  const globber = await glob.create(globPatterns.join("\n"))

  for await (const file of globber.globGenerator()) {
    yield file
  }
}

// Export for testing.
// I aim to make it easier to distinguish the function for
// production code or test code.
export const createGlobPatternsForTest = createGlobPatterns

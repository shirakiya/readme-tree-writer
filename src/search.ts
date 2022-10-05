import * as glob from "@actions/glob"

import type { ConfigType } from "./config"

const createGlobber = async (
  fileNames: string[],
  include: string[],
  exclude: string[],
): Promise<glob.Globber> => {
  let includePatterns: string[]
  if (include.length === 0) {
    includePatterns = fileNames.map((fileName) => `**/${fileName}`)
  } else {
    includePatterns = include
      .map((dir) => {
        return fileNames.map((fileName) => `${dir}/**/${fileName}`)
      })
      .flat()
  }

  const excludePatterns = exclude
    .map((dir) => {
      return fileNames.map((fileName) => `!${dir}/**/${fileName}`)
    })
    .flat()

  const patterns = includePatterns.concat(excludePatterns)

  return await glob.create(patterns.join("\n"))
}

export async function* searchDirs(config: ConfigType): AsyncGenerator<string> {
  const globber = await createGlobber(
    config.fileNames,
    config.include,
    config.exclude,
  )

  for await (const file of globber.globGenerator()) {
    yield file
  }
}

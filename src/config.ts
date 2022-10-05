import { access, readFile } from "node:fs/promises"

import { load } from "js-yaml"
import { z } from "zod"

const Config = z.object({
  fileNames: z.array(z.string()).default(["README.md"]),
  chapter: z.string().default("Tree"),
  include: z.array(z.string()).default([]),
  exclude: z.array(z.string()).default([]),
})

export type ConfigType = z.infer<typeof Config>

const isFileExist = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const loadConfig = async (path: string): Promise<ConfigType> => {
  let c: ConfigType
  if (await isFileExist(path)) {
    const content = await readFile(path, { encoding: "utf8" })
    // If the config file is exist but empty, use default config.
    if (content === "") {
      c = Config.parse({})
    } else {
      c = load(content) as ConfigType
    }
  } else {
    c = Config.parse({})
  }

  const result = Config.safeParse(c)
  if (!result.success) {
    throw new Error(result.error.message)
  }

  return result.data
}

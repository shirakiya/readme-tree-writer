import { readFile } from "node:fs/promises"

import { load } from "js-yaml"
import { z, ZodError } from "zod"

const Config = z.object({
  fileNames: z.array(z.string()).default(["README.md"]),
  chapter: z.string().default("Tree"),
})

export type ConfigType = z.infer<typeof Config>

export const loadConfig = async (path: string): Promise<ConfigType> => {
  const content = await readFile(path, { encoding: "utf8" })
  const c = load(content) as ConfigType

  const err = validateConfig(c)
  if (err) {
    throw new Error(err.message)
  }

  return c
}

const validateConfig = (c: unknown): ZodError | void => {
  const result = Config.safeParse(c)
  if (result.success) {
    return
  }

  return result.error
}

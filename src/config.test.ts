import * as path from "node:path"

import { loadConfig } from "./config"

describe("loadConfig", () => {
  test("success to read actual file", async () => {
    const actual = await loadConfig(
      path.join(__dirname, "../testdata/readmetreerc.full.test.yml"),
    )
    expect(actual).toEqual({
      fileNames: ["README1", "README2"],
      chapter: "Test Chapter",
      include: ["include_dir1", "include_dir2"],
      exclude: ["exclude_dir1", "exclude_dir2"],
    })
  })

  test("return config where unknown fields are skipped", async () => {
    const actual = await loadConfig(
      path.join(__dirname, "../testdata/readmetreerc.unknown.test.yml"),
    )

    expect(actual).toEqual({
      fileNames: ["README1"],
      chapter: "Tree",
      include: [],
      exclude: [],
    })
  })

  test("return config filled with default values when file content is empty", async () => {
    const actual = await loadConfig(
      path.join(__dirname, "../testdata/readmetreerc.empty.test.yml"),
    )

    expect(actual).toEqual({
      fileNames: ["README.md"],
      chapter: "Tree",
      include: [],
      exclude: [],
    })
  })

  test("return default config when file is not found", async () => {
    const actual = await loadConfig("not_found.yml")

    expect(actual).toEqual({
      fileNames: ["README.md"],
      chapter: "Tree",
      include: [],
      exclude: [],
    })
  })
})

import * as path from "node:path"

import { searchDirs } from "./search"

describe("searchDirs", () => {
  test("success", async () => {
    const config = {
      fileNames: ["README.md", "README.dev.md"],
      chapter: "Tree",
      include: ["testdata/testdir1/", "testdata/testdir2"],
      exclude: ["testdata/testdir1/dir1"],
    }

    const actual: string[] = []
    for await (const path of searchDirs(config)) {
      actual.push(path)
    }

    expect(actual).toEqual([
      path.join(__dirname, "../testdata/testdir1/dir2/README.dev.md"),
      path.join(__dirname, "../testdata/testdir2/README.md"),
    ])
  })
})

import * as path from "node:path"

import { createGlobPatternsForTest, searchPaths } from "./search"

describe("searchPaths", () => {
  test("success", async () => {
    const config = {
      fileNames: ["README.md", "README.dev.md"],
      chapter: "Tree",
      include: ["testdata/testdir1/", "testdata/testdir2"],
      exclude: ["testdata/testdir1/dir1"],
    }

    const actual: string[] = []
    for await (const path of searchPaths(config)) {
      actual.push(path)
    }

    expect(actual).toEqual([
      path.join(__dirname, "../testdata/testdir1/README.md"),
      path.join(__dirname, "../testdata/testdir1/dir2/README.dev.md"),
      path.join(__dirname, "../testdata/testdir2/README.md"),
    ])
  })
})

describe("createGlobPatterns", () => {
  const tt: {
    name: string
    fileNames: string[]
    include: string[]
    exclude: string[]
    expected: string[]
  }[] = [
    {
      name: "without include and exclude",
      fileNames: ["README.md", "README.dev.md"],
      include: [],
      exclude: [],
      expected: ["**/README.md", "**/README.dev.md"],
    },
    {
      name: "only include",
      fileNames: ["README.md", "README.dev.md"],
      include: ["testdata/testdir1/", "testdata/testdir2"],
      exclude: [],
      expected: [
        "testdata/testdir1/**/README.md",
        "testdata/testdir1/**/README.dev.md",
        "testdata/testdir2/**/README.md",
        "testdata/testdir2/**/README.dev.md",
      ],
    },
    {
      name: "only exclude",
      fileNames: ["README.md", "README.dev.md"],
      include: [],
      exclude: ["testdata/testdir1/", "testdata/testdir2"],
      expected: [
        "**/README.md",
        "**/README.dev.md",
        "!testdata/testdir1/**/README.md",
        "!testdata/testdir1/**/README.dev.md",
        "!testdata/testdir2/**/README.md",
        "!testdata/testdir2/**/README.dev.md",
      ],
    },
    {
      name: "an include and an exclude",
      fileNames: ["README.md"],
      include: ["testdata/testdir1/"],
      exclude: ["testdata/testdir1/"],
      expected: [
        "testdata/testdir1/**/README.md",
        "!testdata/testdir1/**/README.md",
      ],
    },
  ]

  for (const t of tt) {
    test(t.name, () => {
      const actual = createGlobPatternsForTest(
        t.fileNames,
        t.include,
        t.exclude,
      )

      expect(actual).toEqual(t.expected)
    })
  }
})

import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { TreeWriter } from "./writer"

const createFile = async (path: string, content: string) => {
  await writeFile(path, content)

  return async function () {
    await rm(path)
  }
}

describe("TreeWriter", () => {
  const tmpDir = "testdata/writer.test"

  const tmpPath = () => {
    return join(tmpDir, Math.random().toString(36).slice(-8))
  }

  beforeAll(async () => {
    await mkdir(tmpDir)
  })

  afterAll(async () => {
    await rm(tmpDir, { recursive: true })
  })

  describe("write", () => {
    describe("positive case", () => {
      interface TableTesting {
        name: string
        arrange: {
          chapter: string
          content: string
          tree: string
        }
        want: {
          content: string
          return: boolean
        }
      }

      const tt: TableTesting[] = [
        {
          name: "replace the content of given chapter which is placed in top",
          arrange: {
            chapter: "Tree",
            content: `# Tree
foo
bar
baz

# Other chapter
bbb
`,
            tree: `testdata/testdir1
├── dir1
│   ├── README.md
│   └── dir1
│       └── file
└── dir2
    └── README.dev.md`,
          },
          want: {
            content: `# Tree

\`\`\`
testdata/testdir1
├── dir1
│   ├── README.md
│   └── dir1
│       └── file
└── dir2
    └── README.dev.md
\`\`\`

# Other chapter
bbb
`,
            return: true,
          },
        },
        {
          name: "replace the content of given chapter which is placed in middle",
          arrange: {
            chapter: "Tree",
            content: `# README
aaa

# Tree
foo
bar
baz

# Other chapter
bbb
`,
            tree: "tree",
          },
          want: {
            content: `# README
aaa

# Tree

\`\`\`
tree
\`\`\`

# Other chapter
bbb
`,
            return: true,
          },
        },
        {
          name: "replace the content of given chapter which is placed in bottom",
          arrange: {
            chapter: "Tree",
            content: `# README
aaa

# Tree
`,
            tree: "tree",
          },
          want: {
            content: `# README
aaa

# Tree

\`\`\`
tree
\`\`\`

`,
            return: true,
          },
        },
        {
          name: "replace the content of '##' chapter",
          arrange: {
            chapter: "Tree Tree",
            content: "## Tree Tree\n",
            tree: "tree",
          },
          want: {
            content: `## Tree Tree

\`\`\`
tree
\`\`\`

`,
            return: true,
          },
        },
        {
          name: "empty content",
          arrange: {
            chapter: "Tree",
            content: "",
            tree: "tree",
          },
          want: {
            content: "",
            return: false,
          },
        },
      ]

      for (const t of tt) {
        test(t.name, async () => {
          const writer = new TreeWriter({
            chapter: t.arrange.chapter,
          })
          const path = tmpPath()

          const close = await createFile(path, t.arrange.content)

          const got = await writer.write({
            path,
            tree: t.arrange.tree,
          })

          expect((await readFile(path)).toString()).toBe(t.want.content)
          expect(got).toBe(t.want.return)

          await close()
        })
      }
    })

    describe("negative case", () => {
      test("raise error when not found path is given", async () => {
        const writer = new TreeWriter({
          chapter: "foo",
        })

        await expect(
          writer.write({
            path: "notfound",
            tree: "foo",
          }),
        ).rejects.toThrow(
          Error("ENOENT: no such file or directory, open 'notfound'"),
        )
      })
    })
  })
})

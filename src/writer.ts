import { createReadStream } from "node:fs"
import { writeFile } from "node:fs/promises"
import { createInterface } from "node:readline"

interface options {
  chapter: string
}

export class TreeWriter {
  constructor(private opt: options) {}

  async write(args: { path: string; tree: string }): Promise<void> {
    const rs = createReadStream(args.path)
    const rl = createInterface({ input: rs })

    const newContent: string[] = []

    let isEmpty = true
    let inChapter = false
    for await (const line of rl) {
      isEmpty = false
      const trimedLine = line.trim()
      if (inChapter && trimedLine.startsWith("#")) {
        inChapter = false
      }
      if (!inChapter) {
        newContent.push(line)
      }
      if (trimedLine.startsWith("#") && trimedLine.endsWith(this.opt.chapter)) {
        inChapter = true
        newContent.push("", "```", ...args.tree.split("\n"), "```", "")
      }
    }

    const endOfFile = isEmpty ? "" : "\n"

    await writeFile(args.path, newContent.join("\n") + endOfFile)
  }
}

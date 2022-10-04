import * as path from "node:path"

import { loadConfig } from "./config"

describe("loadConfig", () => {
  test("success to read actual file", async () => {
    const actual = await loadConfig(
      path.join(__dirname, "../testdata/readmetreerc.test.yml"),
    )
    expect(actual).toEqual({
      fileNames: ["README1", "README2"],
      chapter: "Test Chapter",
    })
  })
})

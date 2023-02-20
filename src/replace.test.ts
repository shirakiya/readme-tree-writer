import { replaceTreeOutput } from "./replace"

describe("replaceTreeOutput", () => {
  const tt: {
    name: string
    given: string
    expected: string
  }[] = [
    {
      name: "confirm no-break-space",
      given: "├\u00A0",
      expected: "├ ",
    },
    {
      name: "confirm replacement characters",
      given: "├��",
      expected: "├ ",
    },
    {
      name: "confirm to replace completely",
      given: "├\u00A0��",
      expected: "├  ",
    },
  ]

  for (const t of tt) {
    test(t.name, () => {
      const got = replaceTreeOutput(t.given)

      expect(got).toBe(t.expected)
    })
  }
})

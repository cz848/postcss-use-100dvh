const postcss = require("postcss");

const plugin = require("./");

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it("supports min-height", () => {
  run(
    ".min-h-screen { min-height: 100vh; }",
    ".min-h-screen { min-height: 100vh; }\n" +
      "@supports (-webkit-touch-callout: none) {\n" +
      " .min-h-screen { min-height: 100dvh; } }"
  );
  run(
    ".min-h-screen { min-height: calc(100vh - 4rem); }",
    ".min-h-screen { min-height: calc(100vh - 4rem); }\n" +
      "@supports (-webkit-touch-callout: none) {\n" +
      " .min-h-screen { min-height: calc(100dvh - 4rem); } }"
  );
});

it("supports max-height", () => {
  run(
    ".max-h-screen { max-height: 100vh; }",
    ".max-h-screen { max-height: 100vh; }\n" +
      "@supports (-webkit-touch-callout: none) {\n" +
      " .max-h-screen { max-height: 100dvh; } }"
  );
  run(
    ".max-h-screen { max-height: calc(100vh - 4rem); }",
    ".max-h-screen { max-height: calc(100vh - 4rem); }\n" +
      "@supports (-webkit-touch-callout: none) {\n" +
      " .max-h-screen { max-height: calc(100dvh - 4rem); } }"
  );
});

it("ignores non-100vh height", () => {
  run("body { min-height: 100%; }", "body { min-height: 100%; }");
  run("body { max-height: 100%; }", "body { max-height: 100%; }");
});

it("works inside media queries", () => {
  run(
    "@media (max-width: 600px) { body { height: 100vh; } }",
    "@media (max-width: 600px) { body { height: 100vh; } " +
      "@supports (-webkit-touch-callout: none) { " +
      "body { height: 100dvh; } } }"
  );
  run(
    "@media (max-width: 600px) { body { height: calc(100vh - 4rem); } }",
    "@media (max-width: 600px) { body { height: calc(100vh - 4rem); } " +
      "@supports (-webkit-touch-callout: none) { " +
      "body { height: calc(100dvh - 4rem); } } }"
  );
});

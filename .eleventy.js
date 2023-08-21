const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const createDesmosEmbedCode = (
  state,
  settings
) => `<div class="desmos-container"></div><script>{ 
  let calcContainer = document.currentScript.previousSibling;
  let observer = new IntersectionObserver(() => {
    let graphstate = ${state}; 
    let Calc = Desmos.GraphingCalculator(calcContainer, ${settings || "{}"});
    Calc.setState(graphstate);
  });
  observer.observe(calcContainer);
}</script>`;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addWatchTarget("./src/**");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addShortcode("graphstate", (state, settings) =>
    createDesmosEmbedCode(state, settings)
  );
  eleventyConfig.addShortcode("textmode", async (state, settings) => {
    const tm = await import("@desmodder/text-mode-core");

    const cfg = tm.buildConfig({});
    const raw = tm.textToRaw(cfg, state);
    return createDesmosEmbedCode(JSON.stringify(raw[1]), settings);
  });
  return {
    dir: {
      input: "src",
      output: "docs",
    },
  };
};
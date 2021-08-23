const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const pluginSass = require("eleventy-plugin-sass");

module.exports = function (eleventyConfig) {
  
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);
  
  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);
  
  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
      );
    });
    
  // SCSS Support
  eleventyConfig.addPlugin(pluginSass, {
    watch: './src/_scss/main.scss',
    outputDir: './src/static/css'
  });
  
  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml"
  });

  // eleventyConfig.addPassthroughCopy('./src/static/css')

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addShortcode('price', function(price) {
    return `$${price.toFixed(2)}`;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};


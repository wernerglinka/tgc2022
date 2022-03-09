const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const drafts = require('@metalsmith/drafts');
const metadata = require('@metalsmith/metadata');
const layouts = require('@metalsmith/layouts');
const inplace = require('@metalsmith/in-place');
const permalinks = require('@metalsmith/permalinks');
const processLinks = require('metalsmith-safe-links');
const prism = require('metalsmith-prism');
const blogLists = require('metalsmith-blog-lists');
const writeMetadata = require('metalsmith-writemetadata');

//const blogLists = require('../local_modules/blog-lists');


const CaptureTag = require('nunjucks-capture');
const marked = require('marked');


// functions to extend Nunjucks environment
const toUpper = string => string.toUpperCase();
const spaceToDash = string => string.replace(/\s+/g, '-');
const condenseTitle = string => string.toLowerCase().replace(/\s+/g, '');
const niceDate = string => new Date(string).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const trimSlashes = string => string.replace(/(^\/)|(\/$)/g, "");
const mdToHTML = (mdString) => {
  try {
    return marked.parse(mdString);
  } catch (e) {
    console.error('Error parsing markdown:', e);
    return mdString;
  }
}

// get working directory
// workingDir is a child of "__dirname"
const path = require('path');
const workingDir = path.join(__dirname, '../');

// Define engine options for the inplace and layouts plugins
// these options are passed to the Nunjucks templating engine
const templateConfig = {
  engineOptions: {
    path: [`${workingDir}/layouts`, `${workingDir}/src/sources/assets/icons`],
    filters: {
      toUpper,
      spaceToDash,
      condenseTitle,
      mdToHTML,
      niceDate,
      trimSlashes,
    },
    extensions: {
      CaptureTag: new CaptureTag(),
    },
  },
};

/**
 *  Function to implement the Metalsmith build process
 */
module.exports = function metalsmith(callback) {
  console.log('Building site with metalsmith *************************');

  Metalsmith(workingDir)
    .source('./src/content')
    .destination('./build')
    .clean(true)
    .metadata({
      buildDate: new Date(),
    })

    .use(metadata({
      site: "./src/content/data/siteMetadata.json",
      nav: "./src/content/data/siteNavigation.json",
      customers: "./src/content/data/customers",
      testimonials: "./src/content/data/testimonials"
    }))

    .use(drafts())

    .use(blogLists({  
      featuredQuantity: 4,
      featuredPostOrder: "asc",
      fileExtension: ".md.njk",
      blogDirectoryName: "blog"
    }))

    .use(inplace(templateConfig))

    .use(permalinks())

    // layouts MUST come after permalinks so the template has access to the "path" variable
    .use(layouts(templateConfig))

    .use(prism({
      lineNumbers: true,
      preLoad: ["scala", "java"]
    }))

    .use(processLinks({
      hostNames: ["localhost", "ms-page-sections.netlify.app"]
    }))

    .use(
      assets({
        source: './src/assets/',
        destination: './assets/',
      })
    )

    // Generate a metadata json file for each page
    // Used for Debug only
    .use(
      writeMetadata({
        pattern: ['**/*.html'],
        ignorekeys: ['next', 'contents', 'previous'],
        bufferencoding: 'utf8',
      })
    )

    .build(err => {
      if (err) {
        throw err;
      }
      callback();
    });
};

# Webpack Test Project

by Mike Green

## About

This project has 2 entry point scripts: home.jsx and page2.jsx, both of which render React components. Webpack is configured to take the libraries the 2 scripts share and put them in a vendor bundle.

## Setup

```bash
npm install -g gulp
npm install
gulp

# Or, if you want to minify the output:
gulp --production
```

## Important files

+ [webpack.config.js](https://github.com/mikedamage/webpack-test/blob/master/webpack.config.js)
+ [gulpfile.babel.js](https://github.com/mikedamage/webpack-test/blob/master/gulpfile.babel.js)


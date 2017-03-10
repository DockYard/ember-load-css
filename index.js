/* jshint node: true */
'use strict';

const fs = require('fs');
const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const UglifyJS = require('uglify-js');

const FILES_TO_LOAD = ['loadCSS.js', 'cssrelpreload.js'];

module.exports = {
  name: 'ember-load-css',

  included(app) {
    this._super.included.apply(this,arguments);
    this.options = app.options;
  },

  contentFor(type, config) {
    if (type === 'head-footer') {
      let loadcssPath = path.dirname(require.resolve('fg-loadcss'));

      let content = FILES_TO_LOAD.map((fileName) => {
        let filePath = path.join(loadcssPath, fileName);
        let fileContent = fs.readFileSync(filePath, 'utf8');

        if (this.options.minifyJS.enabled === true) {
          fileContent = UglifyJS.minify(fileContent, { fromString: true }).code;
        }

        return fileContent;
      }).join('\n');

      return `<script>\n${content}</script>`;
    }
  }
};

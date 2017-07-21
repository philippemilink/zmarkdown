'use strict';

var xtend = require('xtend');
var visit = require('unist-util-visit');

var codePlugin = require('./codeVisitor');
var headingPlugin = require('./headingVisitor');
var iframePlugin = require('./iframes');
var referencePlugin = require('./referenceVisitor');

module.exports = preVisit;

function preVisit(ctx, root) {
  var defaultVisitors = {
    tableCell: [codePlugin(ctx, root).codeInTableVisitor],
    definition: [referencePlugin(ctx).definitionVisitor],
    imageReference: [referencePlugin(ctx).imageReferenceVisitor],
    heading: [headingPlugin(ctx)],
    iframe: [iframePlugin]
  };

  var visitors = xtend(defaultVisitors, ctx.preprocessors || {});

  Object.keys(visitors).forEach(function (key) {
    if (Array.isArray(visitors[key])) {
      visitors[key].forEach(function (visitor) {
        return visit(root, key, visitor);
      });
    }
  });
}
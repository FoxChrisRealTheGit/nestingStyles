'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ReactCompositeComponentExtended = require('./ReactCompositeComponentExtended');

var _ReactCompositeComponentExtended2 = _interopRequireDefault(_ReactCompositeComponentExtended);

var _react = require('react');

var _applyMediaQueries = require('./applyMediaQueries.js');

var _applyMediaQueries2 = _interopRequireDefault(_applyMediaQueries);

var _generateUniqueCSSClassName = require('./generateUniqueCSSClassName');

var _generateUniqueCSSClassName2 = _interopRequireDefault(_generateUniqueCSSClassName);

var _stylesToCSS = require('./stylesToCSS');

var _stylesToCSS2 = _interopRequireDefault(_stylesToCSS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isArray = Array.isArray;
var keys = Object.keys;

var registeredMediaQueries = [];
var styles = [];
var mediaQueries = {};

function createStyle(props, className, uniqueKey) {
  styles.push({
    style: props,
    className: className,
    uniqueKey: uniqueKey
  });
  return className;
}

function createStyleSheet(stylesheet, useClassName) {
  if (!useClassName) {
    // default
    stylesheet = (0, _applyMediaQueries2.default)(registeredMediaQueries, stylesheet, true);
    return stylesheet;
  } else {
    ReactElementExtended.maxOverridesLength = StyleSheet.maxOverridesLength;

    // export to separate CSS classes
    var styleSheetStyles = keys(stylesheet);
    var results = {};
    for (var i = 0, l = styleSheetStyles.length; i < l; i++) {
      var styleName = styleSheetStyles[i];
      var isMediaQuery = !styleName.indexOf('@media ');
      var style = stylesheet[styleName];
      var origUniqueKey = (0, _generateUniqueCSSClassName2.default)();
      var uniqueKey = origUniqueKey;
      if (!isProduction) {
        uniqueKey = styleName + '_' + uniqueKey;
      }

      if (isMediaQuery) {
        var mqStyleNames = keys(style);
        var newStyle = {};
        for (var i2 = 0, l2 = mqStyleNames.length; i2 < l2; i2++) {
          var mqStyleName = mqStyleNames[i2];
          var mqStyle = style[mqStyleName];
          var uniqueKey2 = results[mqStyleName];
          if (uniqueKey2) {
            newStyle[uniqueKey2] = mqStyle;
          }
        }

        if (!mediaQueries[styleName]) {
          mediaQueries[styleName] = {};
        }

        keys(newStyle).reduce(function (acc, key) {
          if (!acc[key]) {
            acc[key] = newStyle[key];
          }
          return acc;
        }, mediaQueries[styleName]);

        continue;
      }
      results[styleName] = createStyle(style, isMediaQuery ? styleName : uniqueKey, origUniqueKey);
    }

    return results;
  }
}

var StyleSheet = {
  compile: function compile(maxLength) {
    var mq = keys(mediaQueries).map(function (query) {
      return {
        style: mediaQueries[query],
        className: query,
        uniqueKey: ''
      };
    });

    return (0, _stylesToCSS2.default)(styles.concat(mq), maxLength || 10);
  },
  create: createStyleSheet
};

_ReactCompositeComponentExtended2.default.associateToMediaQuery = function (comp) {
  var styles = comp.props.__cachedStyles;
  for (var i = 0, l = styles.length; i < l; i++) {
    var style = styles[i];
    for (var j = 0, l2 = registeredMediaQueries.length; j < l2; j++) {
      var registeredMediaQuery = registeredMediaQueries[j];
      var stylesheet = registeredMediaQuery.compiled;
      var stylesheetNames = registeredMediaQuery.styleNames;
      for (var i2 = 0, l3 = stylesheetNames.length; i2 < l3; i2++) {
        var styleName = stylesheetNames[i2];
        var compiledStyle = stylesheet[styleName];
        if (style === compiledStyle) {
          registeredMediaQuery.elements.push(comp);
        }
      }
    }
  }
};

exports.default = StyleSheet;
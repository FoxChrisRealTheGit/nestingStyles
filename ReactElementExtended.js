'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _applyStyles = require('./applyStyles');

var _applyStyles2 = _interopRequireDefault(_applyStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isArray = Array.isArray;

var helperObj = {};

function buildProps(props) {
  var builtProps = {
    className: props.className || null,
    style: props.style ? assign({}, props.style) : null,
    styles: undefined
  };
  (0, _applyStyles2.default)(builtProps, props.styles, 0, null, helperObj.maxOverridesLength);
  return builtProps;
}

var originalCreateElement = _react.ReactElement.createElement;
_react.ReactElement.createElement = function (type, props) {
  var args = arguments;
  if (props && props.styles && !props.__cachedStyles && typeof type === 'string') {
    props.__cachedStyles = isArray(props.styles) ? props.styles : [props.styles];
    assign(props, buildProps(props));
  }
  return originalCreateElement.apply(this, [type, props].concat(Array.prototype.slice.call(args, 2)));
};

exports.default = helperObj;
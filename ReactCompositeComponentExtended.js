'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helperObj = {};

var originalMountComponent;
var mountExtensionPoint;

if (_react2.default) {
  mountExtensionPoint = _react2.default;
  originalMountComponent = _react2.default.mountComponent;
} else {
  mountExtensionPoint = _react.Component;
  originalMountComponent = _react.Component.mountComponent;
}

mountExtensionPoint.mountComponent = function (rootID, transaction, context) {
  var call = originalMountComponent.call(this, rootID, transaction, context);
  var instance = !this._instance ? this : this._instance;
  var props = instance.props;
  if (props && props.__cachedStyles) {
    helperObj.associateToMediaQuery(instance);
  }
  return call;
};

exports.default = helperObj;
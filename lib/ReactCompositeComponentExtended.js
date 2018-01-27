var helperObj = {};

import ReactCompositeComponent  from 'react';
import {Component} from 'react';
var originalMountComponent;
var mountExtensionPoint;

if (ReactCompositeComponent) {
  mountExtensionPoint = ReactCompositeComponent;
  originalMountComponent = ReactCompositeComponent.mountComponent;
} else {
  mountExtensionPoint = Component;
  originalMountComponent = Component.mountComponent;
}

mountExtensionPoint.mountComponent = function(rootID, transaction, context) {
  var call = originalMountComponent.call(this, rootID, transaction, context);
  var instance = !this._instance ? this : this._instance;
  var props = instance.props;
  if (props && props.__cachedStyles) {
    helperObj.associateToMediaQuery(instance);
  }
  return call;
};

export default helperObj;
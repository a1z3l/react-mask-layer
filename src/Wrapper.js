'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Layer = require('./Layer');

var _Layer2 = _interopRequireDefault(_Layer);

var _getContainerRenderMixin = require('./_util/getContainerRenderMixin');

var _getContainerRenderMixin2 = _interopRequireDefault(_getContainerRenderMixin);

var createReactClass = require('create-react-class');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Wrapper = createReactClass({
  displayName: 'Wrapper',

  mixins: [(0, _getContainerRenderMixin2["default"])({
    isVisible: function isVisible(instance) {
      return instance.props.visible;
    },

    autoDestroy: false,
    getComponent: function getComponent(instance, extra) {
      return _react2["default"].createElement(_Layer2["default"], (0, _extends3["default"])({}, instance.props, extra, {
        key: 'dialog'
      }));
    }
  })],

  getDefaultProps: function getDefaultProps() {
    return {
      visible: false
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(_ref) {
    var visible = _ref.visible;

    return !!(this.props.visible || visible);
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.props.visible) {
      this.renderComponent({
        afterClose: this.removeContainer,
        onClose: function onClose() {},

        visible: false
      });
    } else {
      this.removeContainer();
    }
  },
  getElement: function getElement(part) {
    return this._component.getElement(part);
  },
  render: function render() {
    return null;
  }
}); /* eslint-disable */

exports["default"] = Wrapper;
module.exports = exports['default'];

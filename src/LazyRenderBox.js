'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var createReactClass = require('create-react-class');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */

var LazyRenderBox = createReactClass({
  displayName: 'LazyRenderBox',
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return !!nextProps.hiddenClassName || !!nextProps.visible;
  },
  render: function render() {
    var className = this.props.className;
    if (!!this.props.hiddenClassName && !this.props.visible) {
      className += ' ' + this.props.hiddenClassName;
    }
    var props = (0, _objectAssign2["default"])({}, this.props);
    delete props.hiddenClassName;
    delete props.visible;
    props.className = className;
    return _react2["default"].createElement('div', props);
  }
});

exports["default"] = LazyRenderBox;
module.exports = exports['default'];

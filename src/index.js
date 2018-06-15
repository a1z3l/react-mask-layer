'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var PropTypes = require("prop-types");

var _addEventListener = require('./_util/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _Wrapper = require('./Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

var createReactClass = require('create-react-class');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mousePosition = void 0; /* eslint-disable */

var mousePositionEventBinded = void 0;

function noop() {}

var MaskLayer = createReactClass({
  displayName: 'MaskLayer',


  propTypes: {
    prefixCls: PropTypes.string,
    /** 对话框是否可见*/
    visible: PropTypes.bool,
    /** 点击蒙层是否允许关闭*/
    maskClosable: PropTypes.bool,
    wrapClassName: PropTypes.string,
    maskTransitionName: PropTypes.string,
    transitionName: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'mx-mask',
      transitionName: 'zoom',
      maskTransitionName: 'fade',
      visible: false,
      maskClosable: true,
      onCancel: noop
    };
  },
  componentDidMount: function componentDidMount() {
    if (mousePositionEventBinded) {
      return;
    }
    // 只有点击事件支持从鼠标位置动画展开
    (0, _addEventListener2["default"])(document.documentElement, 'click', function (e) {
      mousePosition = {
        x: e.pageX,
        y: e.pageY
      };
      // 100ms 内发生过点击事件，则从点击位置动画展示
      // 否则直接 zoom 展示
      // 这样可以兼容非点击方式展开
      setTimeout(function () {
        return mousePosition = null;
      }, 100);
    });
    mousePositionEventBinded = true;
  },
  _handleCancel: function _handleCancel(e) {
    this.props.onCancel(e);
  },
  render: function render() {
    var visible = this.props.visible;


    return _react2["default"].createElement(_Wrapper2["default"], (0, _extends3["default"])({
      onClose: this._handleCancel
    }, this.props, {
      visible: visible,
      mousePosition: mousePosition
    }));
  }
});

exports["default"] = MaskLayer;
module.exports = exports['default'];

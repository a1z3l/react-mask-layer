'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _KeyCode = require('./_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _LazyRenderBox = require('./LazyRenderBox');

var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);

var _getScrollBarSize = require('./_util/getScrollBarSize');

var _getScrollBarSize2 = _interopRequireDefault(_getScrollBarSize);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var createReactClass = require('create-react-class');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uuid = 0; /* eslint-disable */

var openCount = 0;

/* eslint react/no-is-mounted:0 */

function noop() {}

function getScroll(w, top) {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
}

function setTransformOrigin(node, value) {
  var style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
    style[prefix + 'TransformOrigin'] = value;
  });
  style['transformOrigin'] = value;
}

function offset(el) {
  var rect = el.getBoundingClientRect();
  var pos = {
    left: rect.left,
    top: rect.top
  };
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}

var Layer = createReactClass({
  displayName: 'Layer',
  getDefaultProps: function getDefaultProps() {
    return {
      afterClose: noop,
      className: '',
      mask: true,
      visible: false,
      keyboard: true,
      maskClosable: true,
      prefixCls: 'rc-layer',
      onClose: noop
    };
  },
  componentWillMount: function componentWillMount() {
    this.titleId = 'rcLayerTitle' + uuid++;
  },
  componentDidMount: function componentDidMount() {
    this.componentDidUpdate({});
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var props = this.props;
    var mousePosition = this.props.mousePosition;
    if (props.visible) {
      // first show
      if (!prevProps.visible) {
        this.lastOutSideFocusNode = document.activeElement;
        this.addScrollingEffect();
        this.refs.wrap.focus();
        var layerNode = _reactDom2["default"].findDOMNode(this.refs.layer);
        if (mousePosition) {
          var elOffset = offset(layerNode);
          setTransformOrigin(layerNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
        } else {
          setTransformOrigin(layerNode, '');
        }
      }
    } else if (prevProps.visible) {
      if (props.mask && this.lastOutSideFocusNode) {
        try {
          this.lastOutSideFocusNode.focus();
        } catch (e) {
          this.lastOutSideFocusNode = null;
        }
        this.lastOutSideFocusNode = null;
      }
    }
  },
  onAnimateLeave: function onAnimateLeave() {
    if (this.refs.wrap) {
      this.refs.wrap.style.display = 'none';
    }
    this.removeScrollingEffect();
    this.props.afterClose();
  },
  onMaskClick: function onMaskClick(e) {
    if (e.target === e.currentTarget && this.props.maskClosable) {
      this.close(e);
    }
  },
  onKeyDown: function onKeyDown(e) {
    var props = this.props;
    if (props.keyboard && e.keyCode === _KeyCode2["default"].ESC) {
      this.close(e);
    }
    // keep focus inside layer
    if (props.visible) {
      if (e.keyCode === _KeyCode2["default"].TAB) {
        var activeElement = document.activeElement;
        var layerRoot = this.refs.wrap;
        var sentinel = this.refs.sentinel;
        if (e.shiftKey) {
          if (activeElement === layerRoot) {
            sentinel.focus();
          }
        } else if (activeElement === this.refs.sentinel) {
          layerRoot.focus();
        }
      }
    }
  },
  getLayerElement: function getLayerElement() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var dest = {};
    if (props.width !== undefined) {
      dest.width = props.width;
    }
    if (props.height !== undefined) {
      dest.height = props.height;
    }

    var style = (0, _objectAssign2["default"])({}, props.style, dest);
    var transitionName = this.getTransitionName();
    var layerElement = _react2["default"].createElement(
      _LazyRenderBox2["default"],
      {
        role: 'document',
        ref: 'layer',
        style: style,
        className: prefixCls + ' ' + (props.className || ''),
        visible: props.visible
      },
      props.children,
      _react2["default"].createElement(
        'div',
        { tabIndex: 0, ref: 'sentinel', style: { width: 0, height: 0, overflow: 'hidden' } },
        'sentinel'
      )
    );
    return _react2["default"].createElement(
      _rcAnimate2["default"],
      {
        key: 'layer',
        showProp: 'visible',
        onLeave: this.onAnimateLeave,
        transitionName: transitionName,
        component: '',
        transitionAppear: true
      },
      layerElement
    );
  },
  getZIndexStyle: function getZIndexStyle() {
    var style = {};
    var props = this.props;
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex;
    }
    return style;
  },
  getWrapStyle: function getWrapStyle() {
    return (0, _objectAssign2["default"])({}, this.getZIndexStyle(), this.props.wrapStyle);
  },
  getMaskStyle: function getMaskStyle() {
    return (0, _objectAssign2["default"])({}, this.getZIndexStyle(), this.props.maskStyle);
  },
  getMaskElement: function getMaskElement() {
    var props = this.props;
    var maskElement = void 0;
    if (props.mask) {
      var maskTransition = this.getMaskTransitionName();
      maskElement = _react2["default"].createElement(_LazyRenderBox2["default"], {
        style: this.getMaskStyle(),
        key: 'mask',
        className: props.prefixCls + '-mask',
        hiddenClassName: props.prefixCls + '-mask-hidden',
        visible: props.visible
      });
      if (maskTransition) {
        maskElement = _react2["default"].createElement(
          _rcAnimate2["default"],
          {
            key: 'mask',
            showProp: 'visible',
            transitionAppear: true,
            component: '',
            transitionName: maskTransition
          },
          maskElement
        );
      }
    }
    return maskElement;
  },
  getMaskTransitionName: function getMaskTransitionName() {
    var props = this.props;
    var transitionName = props.maskTransitionName;
    var animation = props.maskAnimation;
    if (!transitionName && animation) {
      transitionName = props.prefixCls + '-' + animation;
    }
    return transitionName;
  },
  getTransitionName: function getTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    var animation = props.animation;
    if (!transitionName && animation) {
      transitionName = props.prefixCls + '-' + animation;
    }
    return transitionName;
  },
  getElement: function getElement(part) {
    return this.refs[part];
  },
  setScrollbar: function setScrollbar() {
    if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
      document.body.style.paddingRight = this.scrollbarWidth + 'px';
    }
  },
  addScrollingEffect: function addScrollingEffect() {
    openCount++;
    if (openCount !== 1) {
      return;
    }
    this.checkScrollbar();
    this.setScrollbar();
    document.body.style.overflow = 'hidden';
    // this.adjustLayer();
  },
  removeScrollingEffect: function removeScrollingEffect() {
    openCount--;
    if (openCount !== 0) {
      return;
    }
    document.body.style.overflow = '';
    this.resetScrollbar();
    // this.resetAdjustments();
  },
  close: function close(e) {
    this.props.onClose(e);
  },
  checkScrollbar: function checkScrollbar() {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    if (this.bodyIsOverflowing) {
      this.scrollbarWidth = (0, _getScrollBarSize2["default"])();
    }
  },
  resetScrollbar: function resetScrollbar() {
    document.body.style.paddingRight = '';
  },
  adjustLayer: function adjustLayer() {
    if (this.refs.wrap && this.scrollbarWidth !== undefined) {
      var maskIsOverflowing = this.refs.wrap.scrollHeight > document.documentElement.clientHeight;
      this.refs.wrap.style.paddingLeft = (!this.bodyIsOverflowing && maskIsOverflowing ? this.scrollbarWidth : '') + 'px';
      this.refs.wrap.style.paddingRight = (this.bodyIsOverflowing && !maskIsOverflowing ? this.scrollbarWidth : '') + 'px';
    }
  },
  resetAdjustments: function resetAdjustments() {
    if (this.refs.wrap) {
      this.refs.wrap.style.paddingLeft = this.refs.wrap.style.paddingLeft = '';
    }
  },
  render: function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var style = this.getWrapStyle();
    // clear hide display
    // and only set display after async anim, not here for hide
    if (props.visible) {
      style.display = null;
    }
    return _react2["default"].createElement(
      'div',
      null,
      this.getMaskElement(),
      _react2["default"].createElement(
        'div',
        (0, _extends3["default"])({
          tabIndex: -1,
          onKeyDown: this.onKeyDown,
          className: prefixCls + '-wrap ' + (props.wrapClassName || ''),
          ref: 'wrap',
          onClick: this.onMaskClick,
          role: 'layer',
          'aria-labelledby': props.title ? this.titleId : null,
          style: style
        }, props.wrapProps),
        this.getLayerElement()
      )
    );
  }
});

exports["default"] = Layer;
module.exports = exports['default'];

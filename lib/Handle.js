'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcTooltip = require('rc-tooltip');

var _rcTooltip2 = _interopRequireDefault(_rcTooltip);

var Handle = (function (_React$Component) {
  _inherits(Handle, _React$Component);

  function Handle(props) {
    _classCallCheck(this, Handle);

    _get(Object.getPrototypeOf(Handle.prototype), 'constructor', this).call(this, props);

    this.getStyleProperty = this.getStyleProperty.bind(this);

    this.state = {
      isTooltipVisible: false
    };
  }

  _createClass(Handle, [{
    key: 'showTooltip',
    value: function showTooltip() {
      this.setState({
        isTooltipVisible: true
      });
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      this.setState({
        isTooltipVisible: false
      });
    }
  }, {
    key: 'getStyleProperty',
    value: function getStyleProperty(vertical, inverted, offset) {
      var property = vertical ? { bottom: offset + '%' } : { left: offset + '%' };
      if (vertical && inverted) {
        property = { top: offset + '%' };
      }

      if (vertical === false && inverted === true) {
        property = { right: offset + '%' };
      }

      return property;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var prefixCls = _props.prefixCls;
      var className = _props.className;
      var tipTransitionName = _props.tipTransitionName;
      var tipFormatter = _props.tipFormatter;
      var vertical = _props.vertical;
      var offset = _props.offset;
      var value = _props.value;
      var dragging = _props.dragging;
      var noTip = _props.noTip;
      var inverted = _props.inverted;

      var style = this.getStyleProperty(vertical, inverted, offset);
      var handle = _react2['default'].createElement('div', { className: className, style: style,
        onMouseUp: this.showTooltip.bind(this),
        onMouseEnter: this.showTooltip.bind(this),
        onMouseLeave: this.hideTooltip.bind(this)
      });

      if (noTip) {
        return handle;
      }

      var isTooltipVisible = dragging || this.state.isTooltipVisible;
      return _react2['default'].createElement(
        _rcTooltip2['default'],
        {
          prefixCls: prefixCls.replace('slider', 'tooltip'),
          placement: 'top',
          visible: isTooltipVisible,
          overlay: _react2['default'].createElement(
            'span',
            null,
            tipFormatter(value)
          ),
          delay: 0,
          transitionName: tipTransitionName
        },
        handle
      );
    }
  }]);

  return Handle;
})(_react2['default'].Component);

exports['default'] = Handle;

Handle.propTypes = {
  prefixCls: _react2['default'].PropTypes.string,
  className: _react2['default'].PropTypes.string,
  vertical: _react2['default'].PropTypes.bool,
  offset: _react2['default'].PropTypes.number,
  tipTransitionName: _react2['default'].PropTypes.string,
  tipFormatter: _react2['default'].PropTypes.func,
  value: _react2['default'].PropTypes.number,
  dragging: _react2['default'].PropTypes.bool,
  noTip: _react2['default'].PropTypes.bool,
  inverted: _react2['default'].PropTypes.bool
};
module.exports = exports['default'];
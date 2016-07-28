'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var Steps = (function (_Component) {
    _inherits(Steps, _Component);

    function Steps(props) {
        _classCallCheck(this, Steps);

        _get(Object.getPrototypeOf(Steps.prototype), 'constructor', this).call(this, props);
        this.state = { hover: false };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    _createClass(Steps, [{
        key: 'onMouseEnter',
        value: function onMouseEnter(e) {
            this.setState({ hover: true });
            this.props.handleStepsHover(e, true);
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave(e) {
            this.setState({ hover: false });
            this.props.handleStepsHover(e, false);
        }
    }, {
        key: 'getStyle',
        value: function getStyle(vertical, inverted, offset) {
            var style = {};
            if (vertical && inverted) {
                style.top = offset;
                style.buttom = 'auto';
            } else if (vertical && inverted === false) {
                style.bottom = offset;
                style.top = 'auto';
            } else if (vertical === false && inverted) {
                style.right = offset;
                style.left = 'auto';
            } else if (vertical === false && inverted === false) {
                style.left = offset;
                style.right = 'auto';
            }

            return style;
        }
    }, {
        key: 'calcPoints',
        value: function calcPoints(vertical, inverted, marks, dots, step, min, max) {
            (0, _warning2['default'])(dots ? step > 0 : true, '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
            var points = Object.keys(marks).map(parseFloat);
            if (dots) {
                for (var i = min; i <= max; i = i + step) {
                    if (points.indexOf(i) >= 0) continue;
                    points.push(i);
                }
            }
            return points;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var _props = this.props;
            var prefixCls = _props.prefixCls;
            var vertical = _props.vertical;
            var marks = _props.marks;
            var dots = _props.dots;
            var step = _props.step;
            var included = _props.included;
            var lowerBound = _props.lowerBound;
            var upperBound = _props.upperBound;
            var max = _props.max;
            var min = _props.min;
            var inverted = _props.inverted;
            var stepToolTips = _props.stepToolTips;

            var range = max - min;
            var elements = this.calcPoints(vertical, inverted, marks, dots, step, min, max).map(function (point) {
                var _classNames;

                var offset = Math.abs(point - min) / range * 100 + '%';
                var style = _this.getStyle(vertical, inverted, offset);

                var isActivated = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
                var pointClassName = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, prefixCls + '-dot', true), _defineProperty(_classNames, prefixCls + '-dot-active', isActivated), _classNames));

                var tooltip = typeof stepToolTips === "function" ? stepToolTips(point) : "";
                return _react2['default'].createElement(
                    'span',
                    { className: pointClassName, style: style, key: point, onMouseEnter: _this.onMouseEnter.bind(_this),
                        onMouseLeave: _this.onMouseLeave.bind(_this) },
                    tooltip
                );
            });

            return _react2['default'].createElement(
                'div',
                { className: prefixCls + '-step' },
                elements
            );
        }
    }]);

    return Steps;
})(_react.Component);

exports['default'] = Steps;
module.exports = exports['default'];
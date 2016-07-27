'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Track = function Track(_ref) {
    var className = _ref.className;
    var included = _ref.included;
    var vertical = _ref.vertical;
    var inverted = _ref.inverted;
    var offset = _ref.offset;
    var length = _ref.length;

    var style = {
        visibility: included ? 'visible' : 'hidden'
    };
    if (vertical) {
        style.height = length + '%';
    } else {
        style.width = length + '%';
    }

    if (vertical && inverted) {
        style.top = offset + '%';
        style.buttom = 'auto';
    } else if (vertical && inverted === false) {
        style.bottom = offset + '%';
        style.top = 'auto';
    } else if (vertical === false && inverted) {
        style.right = offset + '%';
        style.left = 'auto';
    } else if (vertical === false && inverted === false) {
        style.left = offset + '%';
        style.right = 'auto';
    }
    return _react2['default'].createElement('div', { className: className, style: style });
};

exports['default'] = Track;
module.exports = exports['default'];
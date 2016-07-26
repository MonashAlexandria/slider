import React from 'react';
import classNames from 'classnames';
import warning from 'warning';

function calcPoints(vertical, inverted, marks, dots, step, min, max) {
    warning(dots ? step > 0 : true, '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
    const points = Object.keys(marks).map(parseFloat);
    if (dots) {
        for (let i = min; i <= max; i = i + step) {
            if (points.indexOf(i) >= 0) continue;
            points.push(i);
        }
    }
    return points;
}

function getStyle(vertical, inverted, offset) {
    let style = {};
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

const Steps = ({
    prefixCls, vertical, marks, dots, step, included,
    lowerBound, upperBound, max, min, inverted
}) => {
    const range = max - min;
    const elements = calcPoints(vertical, inverted, marks, dots, step, min, max).map((point) => {
        const offset = Math.abs(point - min) / range * 100 + '%';
        const style = getStyle(vertical, inverted, offset);

        const isActived = (!included && point === upperBound) ||
            (included && point <= upperBound && point >= lowerBound);
        const pointClassName = classNames({
            [prefixCls + '-dot']: true,
            [prefixCls + '-dot-active']: isActived
        });

        return <span className={pointClassName} style={style} key={point}/>;
    });

    return <div className={prefixCls + '-step'}>{elements}</div>;
};

export default Steps;

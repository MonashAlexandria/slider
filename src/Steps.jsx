import React, {Component} from 'react';
import classNames from 'classnames';
import warning from 'warning';

class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {hover : false};
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseEnter(e) {
        this.setState({hover: true});
        this.props.handleHover(e, true);
    }

    onMouseLeave() {
        this.setState({hover: false});
        this.props.handleHover(e, false);
    }

    getStyle(vertical, inverted, offset) {
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

    calcPoints(vertical, inverted, marks, dots, step, min, max) {
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

    render() {
        const {prefixCls, vertical, marks, dots, step, included,
          lowerBound, upperBound, max, min, inverted, tooltipData, tooltipName} = this.props;

        const range = max - min;
        const elements = this.calcPoints(vertical, inverted, marks, dots, step, min, max).map((point) => {
            const offset = Math.abs(point - min) / range * 100 + '%';
            const style = this.getStyle(vertical, inverted, offset);

            const isActived = (!included && point === upperBound) || (included && point <= upperBound && point >= lowerBound);
            const pointClassName = classNames({
                [prefixCls + '-dot']: true,
                [prefixCls + '-dot-active']: isActived
            });

            const tooltipTitle = (typeof tooltipName === "function") ? tooltipName(point) : tooltipData[point][tooltipName];
            const tooltipWidth = (tooltipTitle.length * 8) + 40;
            return (
                <span className={pointClassName} style={style} key={point} onMouseEnter = {this.onMouseEnter.bind(this)}
                  onMouseLeave = {this.onMouseLeave.bind(this)}>
                    <div style={{width: tooltipWidth}} className="rc-tooltip tooltip">
                        <div className="tool-content">{tooltipTitle}</div>
                    </div>
                </span>
            );
        });

        return <div className={prefixCls + '-step'}>{elements}</div>;
    }

}
export default Steps;

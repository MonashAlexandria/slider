import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import classNames from 'classnames';
import Track from './Track';
import DefaultHandle from './Handle';
import Steps from './Steps';
import Marks from './Marks';

function noop() {
  return null;
}

function isNotTouchEvent(e) {
  return e.touches.length > 1 || (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
}

function getTouchPosition(vertical, e) {
  return vertical ? e.touches[0].clientY : e.touches[0].pageX;
}

function getMousePosition(vertical, e) {
  return vertical ? e.clientY : e.pageX;
}

function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

class Slider extends React.Component {
  constructor(props) {
    super(props);

    const { range, min, max } = props;
    const initialValue = range ? [min, min] : min;
    const defaultValue = ('defaultValue' in props ? props.defaultValue : initialValue);
    const value = (props.value !== undefined ? props.value : defaultValue);

    let upperBound;
    let lowerBound;
    if (props.range) {
      lowerBound = this.trimAlignValue(value[0]);
      upperBound = this.trimAlignValue(value[1]);
    } else {
      upperBound = this.trimAlignValue(value);
    }

    let recent;
    if (props.range && upperBound === lowerBound) {
      recent = lowerBound === max ? 'lowerBound' : 'upperBound';
    } else {
      recent = 'upperBound';
    }

    this.state = {
      handle: null,
      recent: recent,
      upperBound: upperBound,
      // If Slider is not range, set `lowerBound` equal to `min`.
      lowerBound: (lowerBound || min),
    };

    this.getSliderStart = this.getSliderStart.bind(this);
    this.getPositionDifference = this.getPositionDifference.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return;

    const { lowerBound, upperBound } = this.state;
    if (nextProps.range) {
      const value = nextProps.value || [lowerBound, upperBound];
      const nextUpperBound = this.trimAlignValue(value[1], nextProps);
      const nextLowerBound = this.trimAlignValue(value[0], nextProps);
      if (nextLowerBound === lowerBound && nextUpperBound === upperBound) return;

      this.setState({
        upperBound: nextUpperBound,
        lowerBound: nextLowerBound,
      });
      if (this.isValueOutOfBounds(upperBound, nextProps) ||
          this.isValueOutOfBounds(lowerBound, nextProps)) {
        this.props.onChange([nextLowerBound, nextUpperBound]);
      }
    } else {
      const value = nextProps.value !== undefined ? nextProps.value : upperBound;
      const nextValue = this.trimAlignValue(value, nextProps);
      if (nextValue === upperBound && lowerBound === nextProps.min) return;

      this.setState({
        upperBound: nextValue,
        lowerBound: nextProps.min,
      });
      if (this.isValueOutOfBounds(upperBound, nextProps)) {
        this.props.onChange(nextValue);
      }
    }
  }

  onChange(state) {
    const props = this.props;
    const isNotControlled = !('value' in props);
    if (isNotControlled) {
      this.setState(state);
    } else if (state.handle) {
      this.setState({ handle: state.handle });
    }

    const data = { ...this.state, ...state };
    const changedValue = props.range ? [data.lowerBound, data.upperBound] : data.upperBound;
    props.onChange(changedValue);
  }

  onMouseMove(e) {
    const position = getMousePosition(this.props.vertical, e);
    this.onMove(e, position);
  }

  onTouchMove(e) {
    if (isNotTouchEvent(e)) {
      this.end('touch');
      return;
    }

    const position = getTouchPosition(this.props.vertical, e);
    this.onMove(e, position);
  }

  onMove(e, position) {
    pauseEvent(e);
    const props = this.props;
    const state = this.state;

    const diffPosition = this.getPositionDifference(position - this.startPosition);
    const diffValue = diffPosition / this.getSliderLength() * (props.max - props.min);

    const value = this.trimAlignValue(this.startValue + diffValue);
    const oldValue = state[state.handle];

    if (value === oldValue) return;

    if (props.allowCross && value < state.lowerBound && state.handle === 'upperBound') {
      this.onChange({
        handle: 'lowerBound',
        lowerBound: value,
        upperBound: this.state.lowerBound,
      });
      return;
    }

    if (props.allowCross && value > state.upperBound && state.handle === 'lowerBound') {
      this.onChange({
        handle: 'upperBound',
        upperBound: value,
        lowerBound: this.state.upperBound,
      });
      return;
    }

    this.onChange({
      [state.handle]: value,
    });
  }

  onTouchStart(e) {
    if (isNotTouchEvent(e)) return;

    const position = getTouchPosition(this.props.vertical, e);
    this.onStart(position);
    this.addDocumentEvents('touch');
    pauseEvent(e);
  }

  onMouseDown(e) {
    if (e.button !== 0) {
      return;
    }

    const position = getMousePosition(this.props.vertical, e);
    this.onStart(position);
    this.addDocumentEvents('mouse');
    pauseEvent(e);
  }

  onStart(position) {
    const props = this.props;
    props.onBeforeChange(this.getValue());

    const value = this.calcValueByPos(position);
    this.startValue = value;
    this.startPosition = position;

    const state = this.state;
    const { upperBound, lowerBound } = state;

    let valueNeedChanging = 'upperBound';
    if (this.props.range) {
      const isLowerBoundCloser = Math.abs(upperBound - value) > Math.abs(lowerBound - value);
      if (isLowerBoundCloser) {
        valueNeedChanging = 'lowerBound';
      }

      const isAtTheSamePoint = (upperBound === lowerBound);
      if (isAtTheSamePoint) {
        valueNeedChanging = state.recent;
      }

      if (isAtTheSamePoint && (value !== upperBound)) {
        valueNeedChanging = value < upperBound ? 'lowerBound' : 'upperBound';
      }
    }

    this.setState({
      handle: valueNeedChanging,
      recent: valueNeedChanging,
    });

    const oldValue = state[valueNeedChanging];
    if (value === oldValue) return;

    this.onChange({
      [valueNeedChanging]: value,
    });
  }

  getPositionDifference(difference) {
    const { vertical, inverted } = this.props;

    /**
     * This is ideally an XOR of vertical and inverted,
     * condition when vertical and inverted are same i.e. true or false,
     * it is a normal condition.
     * Such as:
     * if vertical = false and invert = false, is equal to normal horizontal slider
     * if vertical = true and invert = false, is equal vertical slider buttom up where we want to negate the result.
     */
    return (vertical === inverted) ? difference : -difference;
  }

  getValue() {
    const { lowerBound, upperBound } = this.state;
    return this.props.range ? [lowerBound, upperBound] : upperBound;
  }

  getSliderLength() {
    const slider = this.refs.slider;
    if (!slider) {
      return 0;
    }

    return this.props.vertical ? slider.clientHeight : slider.clientWidth;
  }

  getSliderStart() {
    const slider = this.refs.slider;
    const rect = slider.getBoundingClientRect();
    const { vertical, inverted } = this.props;
    let startValue = 0;
    if (vertical && inverted) {
      startValue = rect.bottom;
    } else if (vertical && inverted === false) {
      startValue = rect.top;
    } else if (vertical === false && inverted) {
      startValue = rect.right;
    } else if (vertical === false && inverted === false) {
      startValue = rect.left;
    }

    return startValue;
  }

  getPrecision(step) {
    const stepString = step.toString();
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }

    return precision;
  }

  xor(vertical, inverted, response) {
    return (vertical + inverted === 1) ? -response : response;
  }

  isValueOutOfBounds(value, props) {
    return value < props.min || value > props.max;
  }

  trimAlignValue(v, nextProps) {
    const state = this.state || {};
    const { handle, lowerBound, upperBound } = state;
    const { marks, step, min, max, allowCross } = { ...this.props, ...(nextProps || {}) };

    let val = v;
    if (val <= min) {
      val = min;
    }

    if (val >= max) {
      val = max;
    }

    if (!allowCross && handle === 'upperBound' && val <= lowerBound) {
      val = lowerBound;
    }

    if (!allowCross && handle === 'lowerBound' && val >= upperBound) {
      val = upperBound;
    }

    const points = Object.keys(marks).map(parseFloat);
    if (step !== null) {
      const closestStep = (Math.round((val - min) / step) * step) + min;
      points.push(closestStep);
    }

    const diffs = points.map((point) => Math.abs(val - point));
    const closestPoint = points[diffs.indexOf(Math.min.apply(Math, diffs))];

    return step !== null ? parseFloat(closestPoint.toFixed(this.getPrecision(step))) : closestPoint;
  }

  calcOffset(value) {
    const { min, max } = this.props;
    const ratio = (value - min) / (max - min);
    return ratio * 100;
  }

  calcValue(offset) {
    const { vertical, min, max } = this.props;
    const ratio = Math.abs(offset / this.getSliderLength());
    const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
    return value;
  }

  calcValueByPos(position) {
    const pixelOffset = position - this.getSliderStart();
    const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
    return nextValue;
  }

  addDocumentEvents(type) {
    if (type === 'touch') {
      // just work for chrome iOS Safari and Android Browser
      this.onTouchMoveListener = addEventListener(document, 'touchmove', this.onTouchMove.bind(this));
      this.onTouchUpListener = addEventListener(document, 'touchend', this.end.bind(this, 'touch'));
    } else if (type === 'mouse') {
      this.onMouseMoveListener = addEventListener(document, 'mousemove', this.onMouseMove.bind(this));
      this.onMouseUpListener = addEventListener(document, 'mouseup', this.end.bind(this, 'mouse'));
    }
  }

  removeEvents(type) {
    if (type === 'touch') {
      this.onTouchMoveListener.remove();
      this.onTouchUpListener.remove();
    } else if (type === 'mouse') {
      this.onMouseMoveListener.remove();
      this.onMouseUpListener.remove();
    }
  }

  end(type) {
    this.removeEvents(type);
    this.props.onAfterChange(this.getValue());
    this.setState({ handle: null });
  }

  render() {
    const {
        handle,
        upperBound,
        lowerBound,
    } = this.state;
    const {
        className,
        prefixCls,
        disabled,
        vertical,
        dots,
        included,
        range,
        step,
        marks,
        max, min,
        tipTransitionName,
        tipFormatter,
        children,
        inverted,
        tooltipData,
        tooltipName,
        handleStepsHover,
        stepToolTips,
    } = this.props;

    const customHandle = this.props.handle;

    const upperOffset = this.calcOffset(upperBound);
    const lowerOffset = this.calcOffset(lowerBound);

    const handleClassName = prefixCls + '-handle';

    const upperClassName = classNames({
      [handleClassName]: true,
      [handleClassName + '-upper']: true,
    });

    const lowerClassName = classNames({
      [handleClassName]: true,
      [handleClassName + '-lower']: true,
    });

    const isNoTip = (step === null) || (tipFormatter === null);

    const commonHandleProps = {
      prefixCls,
      noTip: isNoTip,
      tipTransitionName,
      tipFormatter,
      vertical,
      inverted,
    };

    const upper = cloneElement(customHandle, {
      ...commonHandleProps,
      className: upperClassName,
      value: upperBound,
      offset: upperOffset,
      dragging: handle === 'upperBound',
    });

    let lower = null;
    if (range) {
      lower = cloneElement(customHandle, {
        ...commonHandleProps,
        className: lowerClassName,
        value: lowerBound,
        offset: lowerOffset,
        dragging: handle === 'lowerBound',
      });
    }

    const sliderClassName = classNames({
      [prefixCls]: true,
      [prefixCls + '-disabled']: disabled,
      [className]: !!className,
      [prefixCls + '-vertical']: this.props.vertical,
      [prefixCls + '-inverted']: this.props.inverted,
    });
    const isIncluded = included || range;
    return (
        <div ref="slider" className={sliderClassName}
             onTouchStart={disabled ? noop : this.onTouchStart.bind(this)}
             onMouseDown={disabled ? noop : this.onMouseDown.bind(this)}
        >
                {upper}
                {lower}
                <Track className={prefixCls + '-track'} vertical={vertical} included={isIncluded}
                   offset={lowerOffset} length={upperOffset - lowerOffset} inverted={inverted}/>
                <Steps prefixCls={prefixCls} vertical={vertical} marks={marks} dots={dots} step={step}
                   included={isIncluded} lowerBound={lowerBound}
                   upperBound={upperBound} max={max} min={min}
                   inverted={inverted}
                   tooltipData={tooltipData}
                   tooltipName={tooltipName}
                   stepToolTips={stepToolTips}
                   handleStepsHover={handleStepsHover}
            />
                <Marks className={prefixCls + '-mark'} vertical={vertical} marks={marks}
                   included={isIncluded} lowerBound={lowerBound}
                   upperBound={upperBound} max={max} min={min}
                   inverted={inverted}
            />
                {children}
            </div>
    );
  }
}

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  marks: PropTypes.object,
  included: PropTypes.bool,
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.any,
  onBeforeChange: PropTypes.func,
  onChange: PropTypes.func,
  onAfterChange: PropTypes.func,
  handle: PropTypes.element,
  tipTransitionName: PropTypes.string,
  tipFormatter: PropTypes.func,
  dots: PropTypes.bool,
  range: PropTypes.bool,
  vertical: PropTypes.bool,
  inverted: PropTypes.bool,
  allowCross: PropTypes.bool,
  handleStepsHover: PropTypes.func,
  stepToolTips: PropTypes.func,
  tooltipData: PropTypes.object,
  tooltipName: PropTypes.string,
};

Slider.defaultProps = {
  prefixCls: 'rc-slider',
  className: '',
  tipTransitionName: '',
  min: 0,
  max: 100,
  step: 1,
  marks: {},
  handle: <DefaultHandle />,
  stepToolTips: noop,
  handleStepsHover: noop,
  onBeforeChange: noop,
  onChange: noop,
  onAfterChange: noop,
  tipFormatter: value => value,
  included: true,
  disabled: false,
  dots: false,
  range: false,
  vertical: false,
  allowCross: true,
  inverted: false,
};

export default Slider;

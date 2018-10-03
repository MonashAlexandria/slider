import React from 'react';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';

export default class Handle extends React.Component {
  constructor(props) {
    super(props);

    this.getStyleProperty = this.getStyleProperty.bind(this);

    this.state = {
      isTooltipVisible: false,
    };
  }

  getStyleProperty(vertical, inverted, offset) {
    let property = vertical ? { bottom: offset + '%' } : { left: offset + '%' };
    if (vertical && inverted) {
      property = { top: offset + '%' };
    }

    if (vertical === false && inverted === true) {
      property = { right: offset + '%' };
    }

    return property;
  }

  showTooltip() {
    this.setState({
      isTooltipVisible: true,
    });
  }

  hideTooltip() {
    this.setState({
      isTooltipVisible: false,
    });
  }

  render() {
    const {
        prefixCls,
        className,
        tipTransitionName,
        tipFormatter,
        vertical,
        offset,
        value,
        dragging,
        noTip,
        inverted,
    } = this.props;

    const style = this.getStyleProperty(vertical, inverted, offset);
    const handle = (
        <div className={className} style={style}
             onMouseUp={this.showTooltip.bind(this)}
             onMouseEnter={this.showTooltip.bind(this)}
             onMouseLeave={this.hideTooltip.bind(this)}
        />
    );

    if (noTip) {
      return handle;
    }

    const isTooltipVisible = dragging || this.state.isTooltipVisible;
    return (
        <Tooltip
            prefixCls={prefixCls.replace('slider', 'tooltip')}
            placement="top"
            visible={isTooltipVisible}
            overlay={<span>{tipFormatter(value)}</span>}
            delay={0}
            transitionName={tipTransitionName}
        >
                {handle}
            </Tooltip>
    );
  }
}

Handle.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  vertical: PropTypes.bool,
  offset: PropTypes.number,
  tipTransitionName: PropTypes.string,
  tipFormatter: PropTypes.func,
  value: PropTypes.number,
  dragging: PropTypes.bool,
  noTip: PropTypes.bool,
  inverted: PropTypes.bool,
};

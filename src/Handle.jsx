import React from 'react';
import Tooltip from 'rc-tooltip';

export default class Handle extends React.Component {
  constructor(props) {
    super(props);

    this.getStyleProperty = this.getStyleProperty.bind(this);

    this.state = {
      isTooltipVisible: false,
    };
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

    let style = this.getStyleProperty(vertical, inverted, offset);
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
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  vertical: React.PropTypes.bool,
  offset: React.PropTypes.number,
  tipTransitionName: React.PropTypes.string,
  tipFormatter: React.PropTypes.func,
  value: React.PropTypes.number,
  dragging: React.PropTypes.bool,
  noTip: React.PropTypes.bool,
  inverted: React.PropTypes.bool,
};

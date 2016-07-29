/* eslint react/no-multi-comp: 0 */
require('rc-slider/assets/index.less');

const React = require('react');
const ReactDOM = require('react-dom');
const Slider = require('rc-slider');

const horizontalStyle = { width: 400, margin: 50 };
const verticalStyle = { float: 'left', width: 200, height: 400, marginBottom: 160, marginLeft: 50 };
const parentStyle = { overflow: 'hidden' };

function log(value) {
  console.log(value);
}

function percentFormatter(v) {
  return v + ' %';
}

const marks = {
    '-10': '-10°C',
    0: <strong>0°C</strong>,
    26: '26°C',
    37: '37°C',
    50: '50°C',
    100: {
        style: {
            color: 'red',
        },
        label: <strong>100°C</strong>,
    },
};

ReactDOM.render(
    <div>
        <div style={parentStyle}>
            <div style={horizontalStyle}>
                <p>Basic Horizontal Slider</p>
                <Slider inverted tipTransitionName="rc-slider-tooltip-zoom-down" onChange={log}/>
            </div>
            <div style={horizontalStyle}>
                <p>Basic Slider，`step=20`</p>
                <Slider inverted step={20} defaultValue={50} onBeforeChange={log}/>
            </div>
            <div style={horizontalStyle}>
                <p>Basic Slider，`step=20, dots`</p>
                <Slider inverted dots step={20} defaultValue={100} onAfterChange={log}/>
            </div>
            <div style={horizontalStyle}>
                <p>Basic Slider with `tipFormatter`</p>
                <Slider inverted tipFormatter={percentFormatter} tipTransitionName="rc-slider-tooltip-zoom-down"
                        onChange={log}/>
            </div>
        </div>

        <div style={parentStyle}>
            <div style={verticalStyle}>
                <p>Basic Vertical Slider</p>
                <Slider vertical inverted tipTransitionName="rc-slider-tooltip-zoom-down" onChange={log}/>
            </div>
            <div style={verticalStyle}>
                <p>Basic Slider，`step=20`</p>
                <Slider vertical inverted step={20} defaultValue={50} onBeforeChange={log}/>
            </div>
            <div style={verticalStyle}>
                <p>Basic Slider，`step=20, dots`</p>
                <Slider
                  vertical
                  stepToolTips="tooltip text"
                  inverted
                  dots step={20} min={0} max={100} />
            </div>
            <div style={verticalStyle}>
                <p>Basic Slider with `tipFormatter`</p>
                <Slider vertical inverted tipFormatter={percentFormatter}
                        tipTransitionName="rc-slider-tooltip-zoom-down" onChange={log}/>
            </div>
        </div>
        <div style={parentStyle}>
            <div style={verticalStyle}>
                <p>Slider with marks, `step=null`</p>
                <Slider vertical inverted min={-10} marks={marks} step={null} onChange={log} defaultValue={20} />
            </div>
            <div style={verticalStyle}>
                <p>Slider with marks and steps</p>
                <Slider vertical inverted dots min={-10} marks={marks} step={10} onChange={log} defaultValue={20} />
            </div>
            <div style={verticalStyle}>
                <p>Slider with marks, `included=false`</p>
                <Slider vertical inverted min={-10} marks={marks} included={false} defaultValue={20} />
            </div>
            <div style={verticalStyle}>
                <p>Slider with marks and steps, `included=false`</p>
                <Slider vertical inverted min={-10} marks={marks} step={10} included={false} defaultValue={20} />
            </div>
            <div style={verticalStyle}>
                <p>Range with marks</p>
                <Slider vertical inverted min={-10} range marks={marks} onChange={log} defaultValue={[20, 40]} />
            </div>
            <div style={verticalStyle}>
                <p>Range with marks and steps</p>
                <Slider vertical inverted min={-10} range marks={marks} step={10} onChange={log} defaultValue={[20, 40]} />
            </div>
        </div>
    </div>, document.getElementById('__react-content'));

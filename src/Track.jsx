import React from 'react';

const Track = ({className, included, vertical, inverted, offset, length}) => {
  const style = {
    visibility: included ? 'visible' : 'hidden',
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
  return <div className={className} style={style}/>;
};

export default Track;

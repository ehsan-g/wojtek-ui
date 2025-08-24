// src/utils/shapeRenderer.js
import React from 'react';
import PropTypes from 'prop-types';

export const renderShape = ({ shape, color, size }) => {
  const half = size / 2;
  const styles = { fill: color };

  switch (shape) {
    case 'circle':
      return <circle cx={half} cy={half} r={half} style={styles} />;
    case 'square':
      return <rect width={size} height={size} style={styles} />;
    case 'triangle':
      return <polygon points={`${half},0 ${size},${size} 0,${size}`} style={styles} />;
    case 'hexagon':
      return (
        <polygon
          points={`${half},0 ${size},${size / 3} ${size},${(2 * size) / 3} ${half},${size} 0,${(2 * size) / 3} 0,${size / 3}`}
          style={styles}
        />
      );
    default:
      return <circle cx={half} cy={half} r={half} style={styles} />;
  }
};

renderShape.propTypes = {
  shape: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

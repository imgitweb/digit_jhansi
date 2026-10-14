import React from 'react';
import { theme } from '../../theme/constants';

const Card = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: theme.radiusLg,
        width: '100%',
        minWidth: 0,  
        padding: 20,
        
        transition: theme.transitionSlow,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

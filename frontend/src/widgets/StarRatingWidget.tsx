import React from 'react';

const StarRatingWidget = (props: any) => {
  const value = props.value || 0;
  return (
    <div>
      {/* <label>{props.label}</label> */}
      <div>
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: i <= value ? 'gold' : 'gray' }}
            onClick={() => props.onChange(i)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRatingWidget;
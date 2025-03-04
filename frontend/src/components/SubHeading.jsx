import React from 'react';

const SubHeading = ({ style, subtitle }) => {
  return (
    <h5 className={`${style} text-gray-600 dark:text-gray-300 mt-3 mb-4`}>
      {subtitle}
    </h5>
  );
};

export default SubHeading;

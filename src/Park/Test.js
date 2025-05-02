import React, { useState, useEffect } from 'react';

const Test = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;

  // return (
  //   <div style={{ padding: '20px', fontSize: '18px' }}>
  //     현재 창 너비: <strong>{width}px</strong>
  //   </div>
  // );
}

export default Test;

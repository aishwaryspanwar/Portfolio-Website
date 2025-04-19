import React from 'react';
import { motion } from 'framer-motion';

const LoadingCursor = ({ mousePosition, loadStage }) => {
  if (loadStage === 'done') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        left: mousePosition.x + 40,
        top: mousePosition.y - 20,
        pointerEvents: 'none',
        zIndex: 9999,
        color: loadStage === 'strip' ? '#262626' : '#ebebeb',
        fontFamily: 'RoxboroughCFRegularItalic',
        fontSize: '1.5rem',
        transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      Loading..
    </motion.div>
  );
};

export default LoadingCursor;

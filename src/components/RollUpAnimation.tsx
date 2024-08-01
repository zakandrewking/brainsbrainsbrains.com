"use client";

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface RollUpAnimationProps {
  children: ReactNode;
  isRolledUp: boolean;
}

const RollUpAnimation: React.FC<RollUpAnimationProps> = ({
  children,
  isRolledUp,
}) => {
  return (
    <motion.div
      style={{
        originY: 0,
        overflow: "hidden",
      }}
      animate={{
        scaleY: isRolledUp ? 0 : 1,
        opacity: isRolledUp ? 0 : 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default RollUpAnimation;

import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useRef } from "react";

interface RollUpAnimationProps {
  children: ReactNode;
  isRolledUp: boolean;
  onHeightChange: (height: number) => void;
}

const RollUpAnimation: React.FC<RollUpAnimationProps> = ({
  children,
  isRolledUp,
  onHeightChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const height = isRolledUp ? 0 : contentRef.current.scrollHeight + 30;
      onHeightChange(height);
    }
  }, [isRolledUp, onHeightChange]);

  return (
    <motion.div
      ref={contentRef}
      initial={false}
      animate={{
        height: isRolledUp ? 0 : "auto",
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      style={{
        transformOrigin: "top",
      }}
    >
      {children}
    </motion.div>
  );
};

export default RollUpAnimation;

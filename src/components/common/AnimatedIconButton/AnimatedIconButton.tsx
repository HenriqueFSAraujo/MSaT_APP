import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedIconButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export const AnimatedIconButton = ({
  onClick,
  children,
  className = '',
}: AnimatedIconButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`transition rounded-full ${className}`}
      type="button"
    >
      {children}
    </motion.button>
  );
};

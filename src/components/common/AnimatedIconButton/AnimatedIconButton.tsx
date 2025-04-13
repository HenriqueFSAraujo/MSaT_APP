import { motion } from "framer-motion";
import { ReactNode } from "react";
import { TooltipAction } from "../TooltipAction/TooltipAction";

type AnimatedIconButtonProps = {
    onClick: () => void;
    children: ReactNode;
    className?: string;
    textDialog?: string;
};

export const AnimatedIconButton = ({
    onClick,
    children,
    className = "",
    textDialog
}: AnimatedIconButtonProps) => {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`transition rounded-full ${className}`}
        >
            {textDialog ? (
                <TooltipAction text={textDialog}>
                    {children}
                </TooltipAction>
            ) : (
                children
            )}
        </motion.button>
    );
};

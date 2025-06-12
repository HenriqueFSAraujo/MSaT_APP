import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipActionProps = {
    text: string;
    children: ReactNode;
};

export const TooltipAction = ({ text, children }: TooltipActionProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

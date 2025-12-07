
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "bars" | "infinite" | "circle-filled" | "pinwheel" | "throbber" | "ellipsis" | "ring";
}

export const Spinner = ({ className, variant = "default", ...props }: SpinnerProps) => {
    if (variant === "bars") {
        // Custom bars implementation
        return (
            <div className={cn("flex items-center justify-center space-x-1", className)} {...props}>
                <div className="h-[60%] w-[15%] animate-bounce bg-current [animation-delay:-0.3s] rounded-full"></div>
                <div className="h-[60%] w-[15%] animate-bounce bg-current [animation-delay:-0.15s] rounded-full"></div>
                <div className="h-[60%] w-[15%] animate-bounce bg-current rounded-full"></div>
            </div>
        );
    }

    // Default fallback (Loader2 style)
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
            {...props}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};

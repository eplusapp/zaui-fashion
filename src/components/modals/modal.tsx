import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import headerLogoImage from "@/static/header-logo.svg";

type Props = {
    open: boolean;
    onClose?: () => void;
    children: ReactNode;

    title?: string;

    closeOnBackdrop?: boolean;

    className?: string;
    contentClassName?: string;
};

export default function Modal({
    open,
    onClose,
    children,
    title,
    closeOnBackdrop = true,
    className,
    contentClassName,
}: Props) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className={clsx(
                "fixed inset-0 z-[9999] flex items-center justify-center",
                className,
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                    if (closeOnBackdrop) {
                        onClose?.();
                    }
                }}
            />

            {/* Content */}
            <div
                className={clsx(
                    "relative z-10 w-[90%] max-w-[500px] rounded-2xl bg-white shadow-xl",
                    "max-h-[85vh] overflow-y-auto",
                    contentClassName,
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-center  px-4 pt-3">
                    <div className="text-lg font-bold">
                        <img src={headerLogoImage} className="max-h-full w-20 h-10 flex-none" />
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full text-xl"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-4 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
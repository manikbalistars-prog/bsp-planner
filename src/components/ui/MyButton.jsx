import * as React from "react";

const MyButton = ({
    label,
    id,
    variant = "primary",
    onClick,
    type = "button",
    disabled = false,
    icon: Icon,
    iconPosition = "left",
    iconOnly = false,
}) => {
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-700 cursor-pointer",
        success: "bg-green-500 text-white hover:bg-green-700 cursor-pointer",
        danger: "bg-red-500 text-white hover:bg-red-700 cursor-pointer",
        warning: "bg-yellow-500 text-white hover:bg-yellow-700 cursor-pointer",
        white: "bg-white text-black hover:bg-stone-200 cursor-pointer",
        disable: "bg-stone-200 text-stone-400 cursor-not-allowed",
    };

    const selectedVariant = variants[variant] || variants.primary;

    return (
        <button
            id={id}
            onClick={onClick}
            type={type}
            disabled={disabled || variant === "disable"}
            className={`
        ${selectedVariant}
        rounded-md text-sm font-medium transition-colors
        flex items-center justify-center gap-2
        ${iconOnly ? "p-2 aspect-square" : "px-3 py-1.5"} 
      `}
        >

            {Icon && (iconPosition === "left" || iconOnly) && (
                <Icon size={18} className="shrink-0" />
            )}


            {!iconOnly && label && <span>{label}</span>}


            {Icon && iconPosition === "right" && !iconOnly && (
                <Icon size={18} className="shrink-0" />
            )}
        </button>
    );
};

export { MyButton };
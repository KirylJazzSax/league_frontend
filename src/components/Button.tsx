import {forwardRef} from "react";

type ButtonProps = {
    handleClick: () => void;
    text: string;
    disabled?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ handleClick, text, disabled}: ButtonProps, ref) => {
    return (
        <button
            ref={ref}
            className={`${disabled ? 'bg-gray-500': 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded transition duration-300`}
            onClick={handleClick} disabled={disabled}
        >{text}</button>
    );
});
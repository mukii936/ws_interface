import React from "react";

interface styleHudProps {
    size: 'big' |'small',
}

export const Shield: React.FC<styleHudProps> = ({size}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none" className={`${size === 'big' ? 'w-[1.88769rem] h-[1.88769rem] ' : 'w-[1.375rem] h-[1.375rem]'} absolute`}>
            <path d="M15.1017 0C15.3911 0 15.6806 0.0593154 15.9449 0.172015L27.7934 4.91131C29.1777 5.46295 30.2097 6.75009 30.2034 8.30415C30.1719 14.1882 27.6046 24.954 16.7629 29.8475C15.7121 30.322 14.4913 30.322 13.4405 29.8475C2.59877 24.954 0.0314904 14.1882 2.86208e-05 8.30415C-0.00626374 6.75009 1.02568 5.46295 2.41 4.91131L14.2648 0.172015C14.5228 0.0593154 14.8122 0 15.1017 0Z" fill="white" />
        </svg>
    );
};

export default Shield;
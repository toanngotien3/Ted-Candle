import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram, FaChartBar, FaCopy, FaRegCopy } from "react-icons/fa";
import { useState } from "react";

const CA = "0xGHOSTTTTTTTTTTTTTTTTTTTTT";

export const Socials = () => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const handleCopyCA = () => {
        navigator.clipboard.writeText(CA).then(
            () => {
                setIsCopied(true);
            },
            () => {
                setIsCopied(false);
            }
        );
    };

    return (
        <div className="flex  w-full relative z-50 mt-[30px]">
            <div className="container flex flex-col gap-[15px]">
                <div className="flex items-center justify-center gap-[15px] md:gap-[30px]">
                    <a target="_blank" className="cursor-pointer social bg-red-600">
                        <FaTelegram size={24} fill="white" />
                    </a>
                    <a target="_blank" className="cursor-pointer social bg-red-600">
                        <FaSquareXTwitter size={24} fill="white" />
                    </a>
                    <a target="_blank" className="cursor-pointer social bg-red-600">
                        <FaChartBar size={24} fill="white" />
                    </a>
                </div>
                <div className="flex flex-row items-center justify-center gap-[10px]">
                    <h4 className="text-base sm:text-2xl text-white ca">{CA}</h4>
                    {isCopied ? (
                        <FaCopy
                            size={20}
                            fill="white"
                            className="cursor-pointer"
                            onClick={handleCopyCA}
                        />
                    ) : (
                        <FaRegCopy
                            size={20}
                            fill="white"
                            className="cursor-pointer"
                            onClick={handleCopyCA}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

let confirmHandler;

function confirm(message) {
    return new Promise((resolve) => {
        if (confirmHandler) {
            confirmHandler(message, resolve);
        }
    });
}

const CustomConfirm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [resolver, setResolver] = useState(null);

    useEffect(() => {
        confirmHandler = (msg, resolveFn) => {
            setMessage(msg);
            setResolver(() => resolveFn);
            setIsOpen(true);
        };
    }, []);

    const handleClose = (result) => {
        setIsOpen(false);
        if (resolver) resolver(result);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md px-5 py-10 border-1 mx-0">
                <div className="text-gray-800 text-center mb-4 text-xl">{message}</div>
                <div className="flex justify-center gap-3">
                    <button
                        className="bg-red-600 text-white px-3 py-1 rounded-sm text-xl hover:bg-red-700 transition"
                        onClick={() => handleClose(false)}
                    >
                        Batal
                    </button>
                    <button
                        className="bg-blue-700 text-white px-3 py-1 rounded-sm text-xl hover:bg-blue-800 transition"
                        onClick={() => handleClose(true)}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

const CustomAlert = ({ message, type, show, onClose }) => {
    useEffect(() => {
        let timer;
        if (show) {
            console.log('Alert showing:', message, type); // Debug log
            timer = setTimeout(() => {
                console.log('Auto-closing alert'); // Debug log
                if (onClose) {
                    onClose();
                }
            }, 3000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [show, message]); // Trigger when show or message changes

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Manual close clicked'); // Debug log
        if (onClose) {
            onClose();
        }
    };

    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
    };

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="alert"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 40
                    }}
                    className={`fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg text-white ${styles[type]} z-[9999]`}
                >
                    <div className="flex items-center justify-between gap-4 min-w-[250px]">
                        <span className="text-base font-medium">{message}</span>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 font-bold text-xl leading-none ml-2 cursor-pointer flex-shrink-0"
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { confirm, CustomConfirm, CustomAlert };
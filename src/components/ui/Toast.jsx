import {useEffect} from "react";

export function Toast({message, type = 'success', onClose}){
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, []);
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600'
    };
    return (
        <div className={`fixed bottom-4 right-4 z-50 ${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg
        flex items-center gap-3 max-w-sm`}>
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">x</button>
        </div>
    )
}
import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any) {
    // getting stored value
    const saved = localStorage.getItem(key);
    const initial = saved && saved !=='undefined' ? JSON.parse(saved) : defaultValue;
    return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        // storing input name
        console.log("storeItem")
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
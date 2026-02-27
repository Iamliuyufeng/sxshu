import React, { useState, useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function ifInExact(exactElms, target) {
    for (let i = 0; i < exactElms.length; i++) {
        let elm = exactElms[i];
        if (elm?.contains(target)) return true;
    }

    return false

}
export function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ifInExact(ref.current, event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("click", listener);
        return () => {
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
};


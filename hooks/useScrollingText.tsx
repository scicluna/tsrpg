import { useState, ReactElement } from 'react';

type UseScrollingTextReturn = [() => JSX.Element, (color: string, text: string, duration?: number) => void];

export function useScrollingText(defaultDuration = 600): UseScrollingTextReturn {
    const [scrollingEffect, setScrollingEffect] = useState({ color: "", text: "" });

    function updateScrollingText(color: string, text: string, duration: number = defaultDuration) {
        setScrollingEffect({ color, text });
        setTimeout(() => {
            setScrollingEffect({ color: "", text: "" });
        }, duration);
    }

    const FloatingText = (): JSX.Element => (
        <div className={`-translate-x-1/2 translate-y-full transition-all absolute top-1/2 left-1/2 z-20`}>
            <p className="text-2xl font-mono animate-bounce" style={{ color: scrollingEffect.color }}>
                {scrollingEffect.text}
            </p>
        </div>
    );

    return [FloatingText, updateScrollingText];
}

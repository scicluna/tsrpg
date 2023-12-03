import { useState } from 'react';

type UseScrollingTextReturn = [() => JSX.Element, (color: string, text: string, duration?: number) => void];

type Message = {
    id: number;
    color: string;
    text: string;
};

export function useScrollingText(defaultDuration = 600): UseScrollingTextReturn {
    const [messages, setMessages] = useState<Message[]>([]);

    function updateScrollingText(color: string, text: string, duration: number = defaultDuration) {
        const id = new Date().getTime(); // Unique ID for the message
        setMessages(prev => [...prev, { id, color, text }]);

        setTimeout(() => {
            setMessages(prev => prev.filter(message => message.id !== id));
        }, duration);
    }

    const FloatingText = (): JSX.Element => (
        <div className={`-translate-x-1/2 translate-y-full transition-all absolute top-[60%] left-1/2 z-20`}>
            {messages.map((message) => (
                <p key={message.id} className="text-2xl font-mono animate-bounce" style={{ color: message.color }}>
                    {message.text}
                </p>
            ))}
        </div>
    );

    return [FloatingText, updateScrollingText];
}

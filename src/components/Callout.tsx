'use client';

import { ReactNode } from 'react';

interface CalloutProps {
    type?: 'info' | 'tip' | 'warning' | 'success';
    title?: string;
    children: ReactNode;
}

const icons: Record<string, string> = {
    info: '💡',
    tip: '✨',
    warning: '⚠️',
    success: '✅',
};

export default function Callout({ type = 'info', title, children }: CalloutProps) {
    return (
        <div className={`callout callout--${type}`}>
            <div className="callout__header">
                <span className="callout__icon">{icons[type]}</span>
                {title && <strong className="callout__title">{title}</strong>}
            </div>
            <div className="callout__body">{children}</div>
        </div>
    );
}

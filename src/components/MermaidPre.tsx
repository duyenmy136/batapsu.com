'use client';

import { ReactNode, ReactElement } from 'react';
import Mermaid from './Mermaid';

interface CodeProps {
    className?: string;
    children?: string;
}

export default function MermaidPre({ children, ...props }: { children?: ReactNode }) {
    const child = children as ReactElement<CodeProps> | undefined;
    if (
        child &&
        typeof child === 'object' &&
        'props' in child &&
        child.props?.className?.includes('language-mermaid')
    ) {
        const code = child.props.children as string;
        return <Mermaid chart={code.trim()} />;
    }

    return <pre {...props}>{children}</pre>;
}

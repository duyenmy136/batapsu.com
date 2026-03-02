'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const { theme } = useTheme();

    useEffect(() => {
        const renderChart = async () => {
            try {
                const mermaid = (await import('mermaid')).default;

                mermaid.initialize({
                    startOnLoad: false,
                    theme: theme === 'dark' ? 'dark' : 'default',
                    themeVariables: theme === 'dark'
                        ? {
                            primaryColor: '#8B5CF6',
                            primaryTextColor: '#F5F3FF',
                            primaryBorderColor: '#6D28D9',
                            lineColor: '#A78BFA',
                            secondaryColor: '#1A1328',
                            tertiaryColor: '#241C36',
                            noteTextColor: '#F5F3FF',
                            noteBkgColor: '#241C36',
                            fontFamily: 'Be Vietnam Pro, sans-serif',
                        }
                        : {
                            primaryColor: '#EDE9FE',
                            primaryTextColor: '#4C1D95',
                            primaryBorderColor: '#8B5CF6',
                            lineColor: '#8B5CF6',
                            secondaryColor: '#FCE7F3',
                            tertiaryColor: '#F5F3FF',
                            fontFamily: 'Be Vietnam Pro, sans-serif',
                        },
                    flowchart: {
                        htmlLabels: true,
                        curve: 'basis',
                    },
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                setSvg(`<pre style="color: red;">Mermaid Error: ${error}</pre>`);
            }
        };

        renderChart();
    }, [chart, theme]);

    return (
        <div
            ref={containerRef}
            className="mermaid-container"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

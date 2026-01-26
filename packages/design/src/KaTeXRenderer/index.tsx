// KaTeXRenderer.tsx
import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // 引入 KaTeX 的样式

interface KaTeXRendererProps {
  expression: string; // LaTeX 表达式
  errorMessage?: string; // 错误信息显示
  displayMode?: boolean; // 是否使用 display mode
}

const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  expression,
  errorMessage = 'Invalid LaTeX expression',
  displayMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
console.log('expression', expression)
  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(String.raw`${expression}`, containerRef.current, {
          throwOnError: false,
          displayMode,
        });
      } catch (error) {
        containerRef.current.innerHTML = `<span style="color: red;">${errorMessage}</span>`;
        console.error('KaTeX render error:', error);
      }
    }
  }, [expression, displayMode, errorMessage]);

  return <div ref={containerRef} />;
};

export default KaTeXRenderer;



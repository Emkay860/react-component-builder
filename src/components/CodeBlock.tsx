// components/CodeBlock.tsx
import hljs from 'highlight.js'; // core
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css'; // your chosen theme
import { useEffect, useRef } from 'react';

// (optional) register only the langs you need to keep bundle size down
hljs.registerLanguage('javascript', javascript);

type Props = {
  language?: string;   // e.g. "javascript", "python", "bash"
  children: string;    // the code string
};

export default function CodeBlock({ language = 'plaintext', children }: Props) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language]);

  return (
    <pre className="mt-8 bg-black p-1 rounded text-sm font-mono whitespace-pre-wrap">
      <code ref={codeRef} className={language}>
        {children.trim()}
      </code>
    </pre>
  );
}

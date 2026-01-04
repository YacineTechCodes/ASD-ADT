import React, { useMemo } from 'react';
import './Builder.css';

interface Props {
    code: string;
}

type NodeType = 'text' | 'block';

interface CodeNode {
    type: NodeType;
    content: string; // For text
    keyword?: string; // For blocks (e.g., 'If', 'For')
    header?: string; // The opening line
    children?: CodeNode[]; // Nested content
    footer?: string; // The closing line
}

// Sorted by length descending to match 'EndIf' before 'End'
const KEYWORDS = ['function', 'procedure', 'if', 'for', 'while', 'begin', 'else'];
const END_KEYWORDS = ['endif', 'endfor', 'endwhile', 'end'];

// Simple tokenizer/parser
const parseCode = (code: string): CodeNode[] => {
    const lines = code.split('\n').filter(line => line.trim() !== '');
    const root: CodeNode[] = [];

    // Stack now tracks the container we are pushing to
    const stack: { node: CodeNode, parentChildren: CodeNode[] }[] = [];

    const getStartKeyword = (line: string): string | null => {
        const looseMatch = line.trim().toLowerCase();
        for (const kw of KEYWORDS) {
            // regex to match keyword at start of line with word boundary
            // e.g. "If(x)" or "If "
            if (new RegExp(`^${kw}(\\s|\\(|$)`, 'i').test(looseMatch)) return kw;
        }
        return null;
    };

    const getEndKeyword = (line: string): string | null => {
        const looseMatch = line.trim().toLowerCase();
        for (const kw of END_KEYWORDS) {
            if (new RegExp(`^${kw}(\\s|\\(|$)`, 'i').test(looseMatch)) return kw;
        }
        return null;
    };

    let currentContainer = root;

    for (const line of lines) {
        const trimmed = line.trim();
        const startKw = getStartKeyword(trimmed);
        const endKw = getEndKeyword(trimmed);

        // Handle End
        if (endKw) {
            // Check if this line is ALSO a start (e.g. "End If" -> "If"?) 
            // No, "EndIf" is an end. "End" is an end.
            // Pop from stack
            if (stack.length > 0) {
                const { node } = stack.pop()!;
                node.footer = line;

                // After closing a block, where do we go?
                // We go back to the parent's container
                if (stack.length > 0) {
                    currentContainer = stack[stack.length - 1].node.children!;
                } else {
                    currentContainer = root;
                }
            } else {
                // Unbalanced end
                currentContainer.push({ type: 'text', content: line });
            }
            continue;
        }

        // Handle Else / ElseIf
        // They are "start" keywords in our list, but we treat them specially regarding indentation
        if (startKw === 'else') {
            // Just add as a text node, but with a special flag/class?
            // Or treat as a block separation?
            // For visual fix: we'll render it as a special "outdent" text node
            currentContainer.push({ type: 'text', content: line, keyword: 'else' });
            continue;
        }

        // Handle Start
        if (startKw) {
            const newNode: CodeNode = {
                type: 'block',
                keyword: startKw,
                header: line,
                children: [],
                content: ''
            };
            currentContainer.push(newNode);
            stack.push({ node: newNode, parentChildren: currentContainer });
            currentContainer = newNode.children!;
            continue;
        }

        // Normal text
        currentContainer.push({ type: 'text', content: line });
    }

    return root;
};


// Recursive Renderer
const NodeRenderer: React.FC<{ node: CodeNode }> = ({ node }) => {
    if (node.type === 'text') {
        const isElse = node.keyword === 'else';
        const classes = ['code-line'];
        if (isElse) classes.push('outdent-node', 'kw-else');

        return <div className={classes.join(' ')}>{node.content}</div>;
    }

    return (
        <div className="code-block-structure">
            <div className={`code-header kw-${node.keyword}`}>{node.header}</div>
            <div className="code-children">
                <div className="indent-guide"></div>
                <div className="children-content">
                    {node.children?.map((child, i) => (
                        <NodeRenderer key={i} node={child} />
                    ))}
                </div>
            </div>
            {node.footer && <div className={`code-footer kw-${node.keyword}`}>{node.footer}</div>}
        </div>
    );
};

export const PseudoCodeRenderer: React.FC<Props> = ({ code }) => {
    const tree = useMemo(() => parseCode(code), [code]);

    return (
        <div className="pseudo-code-container">
            {tree.map((node, i) => <NodeRenderer key={i} node={node} />)}
        </div>
    );
};

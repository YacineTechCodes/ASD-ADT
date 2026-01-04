import React, { useState } from 'react';
import type { ADT } from '../../types';
import './Builder.css';

interface Props {
    adt: ADT;
}

export const ADTPreview: React.FC<Props> = ({ adt }) => {
    const [activeTab, setActiveTab] = useState<'contiguous' | 'chained'>('contiguous');
    const activeImplementation = adt.implementations[activeTab];

    return (
        <div className="adt-preview-pane">
            <div className="adt-preview-content">
                <div className="preview-header">
                    <h1 className="preview-title">{adt.name || 'ADT Name'}</h1>
                    <div className="preview-subtitle">{adt.domain || 'Domain description goes here...'}</div>
                </div>

                {/* Profiles Section */}
                <div className="preview-section">
                    <h3>Profiles</h3>
                    <div className="operation-list">
                        {adt.profiles.length === 0 && <p className="text-gray-500">No profiles defined.</p>}
                        {adt.profiles.map(p => (
                            <div key={p.id} className="preview-op-item">
                                <span className="op-signature">{p.signature}</span>
                                <div className="op-desc">{p.description}</div>
                                {p.preconditions && p.preconditions.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#ff7b72' }}>
                                        <strong>Pre:</strong> {p.preconditions.join(', ')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Axioms Section */}
                <div className="preview-section">
                    <h3>Axioms</h3>
                    {adt.axioms.length === 0 && <p className="text-gray-500">No axioms defined.</p>}
                    <ul className="axiom-list">
                        {adt.axioms.map((axiom, idx) => (
                            <li key={idx} className="axiom-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{axiom.expression}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {axiom.relatedProfileIds.map(pid => {
                                            const profileName = adt.profiles.find(p => p.id === pid)?.name;
                                            if (!profileName) return null;
                                            return (
                                                <span key={pid} style={{
                                                    fontSize: '0.7em',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    color: '#ccc'
                                                }}>
                                                    {profileName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Implementation Section */}
                <div className="preview-section">
                    <h3>Implementation</h3>
                    <div className="implementation-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'contiguous' ? 'active' : ''}`}
                            onClick={() => setActiveTab('contiguous')}
                        >
                            Contiguous
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'chained' ? 'active' : ''}`}
                            onClick={() => setActiveTab('chained')}
                        >
                            Chained
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fff', marginBottom: '1rem', borderBottom: '1px solid #333' }}>Domain Value Space</h4>
                        <div className="code-block">
                            {activeImplementation.domainSpace || '// No domain space defined'}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '1rem', borderBottom: '1px solid #333' }}>Methods</h4>
                        {adt.profiles.map(p => (
                            <div key={p.id} style={{ marginBottom: '2rem' }}>
                                <div style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                                    {p.name}
                                </div>
                                <div className="code-block">
                                    {activeImplementation.methods[p.id] || `// Implementation for ${p.name} missing`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

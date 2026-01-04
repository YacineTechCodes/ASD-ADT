import React, { useState } from 'react';
import type { ADTProfile } from '../../types';

interface Props {
    profiles: ADTProfile[];
    onChange: (profiles: ADTProfile[]) => void;
}

export const ProfileInput: React.FC<Props> = ({ profiles, onChange }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const addProfile = () => {
        const newId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
        const newProfile: ADTProfile = {
            id: newId,
            name: 'New Function',
            signature: 'op() -> void',
            description: 'Description of the function',
            preconditions: []
        };
        onChange([...profiles, newProfile]);
        setExpandedId(newId);
    };

    const updateProfile = (id: string, updates: Partial<ADTProfile>) => {
        onChange(profiles.map(p => (p.id === id ? { ...p, ...updates } : p)));
    };

    const removeProfile = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(profiles.filter(p => p.id !== id));
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const updatePreconditions = (id: string, text: string) => {
        const preconditions = text.split('\n');
        updateProfile(id, { preconditions });
    };

    return (
        <div className="form-group">
            <label className="form-label">Profiles (Functions)</label>
            <div className="operations-list">
                {profiles.map(p => {
                    const isExpanded = expandedId === p.id;
                    return (
                        <div
                            key={p.id}
                            className="operation-item"
                            onClick={() => toggleExpand(p.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="operation-header">
                                {isExpanded ? (
                                    <input
                                        className="form-input"
                                        style={{ width: '40%', marginRight: '10px' }}
                                        value={p.name}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => updateProfile(p.id, { name: e.target.value })}
                                        placeholder="Name"
                                        autoFocus
                                    />
                                ) : (
                                    <span style={{ fontWeight: 600, color: '#e0e0e0' }}>{p.name}</span>
                                )}

                                <button
                                    className="btn-danger"
                                    onClick={(e) => removeProfile(p.id, e)}
                                    title="Remove"
                                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                                >
                                    ✕
                                </button>
                            </div>

                            {!isExpanded && (
                                <div style={{ color: '#888', fontSize: '0.85em', fontFamily: 'monospace' }}>
                                    {p.signature}
                                </div>
                            )}

                            {isExpanded && (
                                <div
                                    className="operation-details"
                                    onClick={e => e.stopPropagation()}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}
                                >
                                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: 0 }}>Signature</label>
                                    <input
                                        className="form-input"
                                        value={p.signature}
                                        onChange={e => updateProfile(p.id, { signature: e.target.value })}
                                        placeholder="Signature (e.g., push(item) -> void)"
                                    />

                                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: 0 }}>Description</label>
                                    <textarea
                                        className="form-textarea"
                                        style={{ minHeight: '60px' }}
                                        value={p.description || ''}
                                        onChange={e => updateProfile(p.id, { description: e.target.value })}
                                        placeholder="Description"
                                    />

                                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: 0 }}>Preconditions (one per line)</label>
                                    <textarea
                                        className="form-textarea"
                                        style={{ minHeight: '50px' }}
                                        value={p.preconditions?.join('\n') || ''}
                                        onChange={e => updatePreconditions(p.id, e.target.value)}
                                        placeholder="!empty(s)"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="btn-secondary" onClick={addProfile} style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Profile
            </button>
        </div>
    );
};

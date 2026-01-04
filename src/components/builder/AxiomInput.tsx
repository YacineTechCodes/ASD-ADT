import React from 'react';
import type { Axiom, ADTProfile } from '../../types';

interface Props {
    axioms: Axiom[];
    profiles: ADTProfile[];
    onChange: (axioms: Axiom[]) => void;
}

export const AxiomInput: React.FC<Props> = ({ axioms, profiles, onChange }) => {
    const addAxiom = () => {
        const newAxiom: Axiom = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            expression: 'new_axiom() = true',
            relatedProfileIds: [],
        };
        onChange([...axioms, newAxiom]);
    };

    const updateAxiom = (id: string, updates: Partial<Axiom>) => {
        onChange(axioms.map(ax => (ax.id === id ? { ...ax, ...updates } : ax)));
    };

    const removeAxiom = (id: string) => {
        onChange(axioms.filter(ax => ax.id !== id));
    };

    const toggleProfileLink = (axiomId: string, profileId: string) => {
        const axiom = axioms.find(a => a.id === axiomId);
        if (!axiom) return;

        const currentLinks = new Set(axiom.relatedProfileIds);
        if (currentLinks.has(profileId)) {
            currentLinks.delete(profileId);
        } else {
            currentLinks.add(profileId);
        }

        updateAxiom(axiomId, { relatedProfileIds: Array.from(currentLinks) });
    };

    return (
        <div className="form-group">
            <label className="form-label">Axioms</label>
            <div className="axiom-list-editor">
                {axioms.map(ax => (
                    <div key={ax.id} className="operation-item">
                        <div className="operation-header" style={{ marginBottom: '0.5rem' }}>
                            <input
                                className="form-input"
                                style={{ fontFamily: 'monospace' }}
                                value={ax.expression}
                                onChange={e => updateAxiom(ax.id, { expression: e.target.value })}
                                placeholder="empty(new()) = true"
                            />
                            <button
                                className="btn-danger"
                                onClick={() => removeAxiom(ax.id)}
                                style={{ marginLeft: '10px' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="profile-links">
                            <label style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.5rem' }}>Related Profiles:</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {profiles.map(p => (
                                    <button
                                        key={p.id}
                                        className={`tag-btn ${ax.relatedProfileIds.includes(p.id) ? 'active' : ''}`}
                                        onClick={() => toggleProfileLink(ax.id, p.id)}
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: ax.relatedProfileIds.includes(p.id) ? 'var(--accent-primary)' : 'var(--bg-input)',
                                            color: ax.relatedProfileIds.includes(p.id) ? 'white' : 'var(--text-secondary)',
                                            border: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-secondary" onClick={addAxiom} style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Axiom
            </button>
        </div>
    );
};

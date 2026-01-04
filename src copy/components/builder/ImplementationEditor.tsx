import React from 'react';
import type { ADTImplementation, ADTProfile } from '../../types';

interface Props {
    implementation: ADTImplementation;
    profiles: ADTProfile[];
    onChange: (impl: ADTImplementation) => void;
}

export const ImplementationEditor: React.FC<Props> = ({ implementation, profiles, onChange }) => {
    const handleDomainChange = (code: string) => {
        onChange({ ...implementation, domainSpace: code });
    };

    const handleMethodChange = (profileId: string, code: string) => {
        onChange({
            ...implementation,
            methods: {
                ...implementation.methods,
                [profileId]: code
            }
        });
    };

    return (
        <div className="implementation-editor">
            <div className="form-group">
                <label className="form-label">Domain Value Space (Structs/Types)</label>
                <textarea
                    className="form-textarea"
                    style={{ minHeight: '120px', fontFamily: 'monospace' }}
                    value={implementation.domainSpace}
                    onChange={e => handleDomainChange(e.target.value)}
                    placeholder="// struct MyADT { ... }"
                />
            </div>

            <h4 className="section-title" style={{ fontSize: '1rem', marginTop: '1.5rem' }}>Methods</h4>

            {profiles.map(p => (
                <div key={p.id} className="form-group">
                    <label className="form-label" style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                        {p.name} implementation
                    </label>
                    <textarea
                        className="form-textarea"
                        style={{ minHeight: '100px', fontFamily: 'monospace' }}
                        value={implementation.methods[p.id] || ''}
                        onChange={e => handleMethodChange(p.id, e.target.value)}
                        placeholder={`procedure ${p.name}(...)`}
                    />
                </div>
            ))}
        </div>
    );
};

import React, { useRef, useState } from 'react';
import type { ADT, ADTImplementation } from '../../types';
import { TEMPLATES } from '../../templates';
import { ProfileInput } from './ProfileInput';
import { AxiomInput } from './AxiomInput';
import { ImplementationEditor } from './ImplementationEditor';
import './Builder.css';

interface Props {
    adt: ADT;
    onChange: (adt: ADT) => void;
}

export const ADTEditor: React.FC<Props> = ({ adt, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeImplTab, setActiveImplTab] = useState<'contiguous' | 'chained'>('contiguous');

    const handleChange = (field: keyof ADT, value: any) => {
        onChange({ ...adt, [field]: value });
    };

    const handleImplUpdate = (implData: ADTImplementation) => {
        onChange({
            ...adt,
            implementations: {
                ...adt.implementations,
                [activeImplTab]: implData
            }
        });
    };

    const loadTemplate = (templateKey: string) => {
        if (TEMPLATES[templateKey]) {
            onChange(JSON.parse(JSON.stringify(TEMPLATES[templateKey])));
        }
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adt, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", (adt.name || "adt") + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);

                    // Migration for legacy JSON (v0 format)
                    if (!json.profiles && json.operations) {
                        json.profiles = json.operations.map((op: any) => ({
                            ...op,
                            preconditions: []
                        }));
                    }

                    // Migration for legacy implementations (string -> object)
                    if (typeof json.implementations?.contiguous === 'string') {
                        json.implementations.contiguous = {
                            id: 'impl-contiguous',
                            name: 'Contiguous',
                            domainSpace: json.implementations.contiguous,
                            methods: {}
                        };
                    }
                    if (typeof json.implementations?.chained === 'string') {
                        json.implementations.chained = {
                            id: 'impl-chained',
                            name: 'Chained',
                            domainSpace: json.implementations.chained,
                            methods: {}
                        };
                    }

                    onChange(json);
                } catch (error) {
                    console.error(error);
                    alert("Error parsing JSON file");
                }
            };
            reader.readAsText(file);
        }
        if (event.target) event.target.value = '';
    };

    return (
        <div className="adt-editor-pane">
            <div className="adt-toolbar">
                <button className="btn-secondary" onClick={() => loadTemplate('stack')}>Load Stack</button>
                <button className="btn-secondary" onClick={() => loadTemplate('queue')}>Load Queue</button>
                <div style={{ flex: 1 }}></div>
                <button className="btn-secondary" onClick={handleExport}>Export JSON</button>
                <button className="btn-secondary" onClick={handleImportClick}>Import JSON</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>

            <h2 className="section-title">ADT Editor</h2>

            <div className="form-group">
                <label className="form-label">ADT Name</label>
                <input
                    className="form-input"
                    value={adt.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="e.g. List, Stack, Queue"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Domain</label>
                <input
                    className="form-input"
                    value={adt.domain}
                    onChange={e => handleChange('domain', e.target.value)}
                    placeholder="e.g. A sequence of elements of type T"
                />
            </div>

            <ProfileInput
                profiles={adt.profiles}
                onChange={p => handleChange('profiles', p)}
            />

            <AxiomInput
                axioms={adt.axioms}
                profiles={adt.profiles}
                onChange={a => handleChange('axioms', a)}
            />

            <h3 className="section-title" style={{ marginTop: '2rem' }}>Implementation</h3>

            <div className="implementation-tabs" style={{ marginBottom: '1rem' }}>
                <button
                    className={`tab-btn ${activeImplTab === 'contiguous' ? 'active' : ''}`}
                    onClick={() => setActiveImplTab('contiguous')}
                >
                    Contiguous
                </button>
                <button
                    className={`tab-btn ${activeImplTab === 'chained' ? 'active' : ''}`}
                    onClick={() => setActiveImplTab('chained')}
                >
                    Chained
                </button>
            </div>

            <ImplementationEditor
                key={activeImplTab} // Force re-render on tab switch
                implementation={adt.implementations[activeImplTab]}
                profiles={adt.profiles}
                onChange={handleImplUpdate}
            />
        </div>
    );
};

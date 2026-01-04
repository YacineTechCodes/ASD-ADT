import { useState } from 'react';
import type { ADT } from './types';
import { ADTEditor } from './components/builder/ADTEditor';
import { ADTPreview } from './components/builder/ADTPreview';
import './components/builder/Builder.css';
import './App.css';

function App() {
  const [adt, setAdt] = useState<ADT>({
    name: '',
    domain: '',
    uses: '',
    profiles: [],
    axioms: [],
    implementations: {
      contiguous: {
        id: 'impl-contiguous',
        name: 'Contiguous',
        domainSpace: '',
        methods: {}
      },
      chained: {
        id: 'impl-chained',
        name: 'Chained',
        domainSpace: '',
        methods: {}
      },
    },
  });

  return (
    <div className="adt-builder-container">
      <ADTEditor adt={adt} onChange={setAdt} />
      <ADTPreview adt={adt} />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import DynamicTable from './DynamicTable';
import DynamicForm from './components/DynamicForm';

const App: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [schema, setSchema] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/models').then(r => setModels(r.data));
  }, []);

  const loadModel = async (key: string) => {
    setCurrentModel(key);
    const [schemaRes, itemsRes] = await Promise.all([
      axios.get(`http://localhost:8000/models/${key}/schema`),
      axios.get(`http://localhost:8000/models/${key}/items`)
    ]);
    setSchema(schemaRes.data);
    setItems(itemsRes.data);
  };

  const refresh = () => currentModel && loadModel(currentModel);

  return (
    <div className="d-flex">
      <Sidebar models={models} current={currentModel} onSelect={loadModel} />
      <div className="flex-grow-1 p-4">
        {currentModel && schema ? (
          <>
            <h2>{currentModel.toUpperCase()}</h2>
            <DynamicForm schema={schema} modelKey={currentModel} onSuccess={refresh} />
            <DynamicTable schema={schema} data={items} modelKey={currentModel} onRefresh={refresh} />
          </>
        ) : (
          <h4 className="text-center mt-5">Выберите сущность слева</h4>
        )}
      </div>
    </div>
  );
};

export default App;
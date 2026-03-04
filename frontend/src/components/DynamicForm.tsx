import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import ReferenceWidget from '../widgets/ReferenceWidget';
import MultiReferenceWidget from '../widgets/MultiReferenceWidget';
import { Button } from 'react-bootstrap';
import StarRatingWidget from '../widgets/StarRatingWidget';
import { generateUiSchema } from '../utils/UiSchema';

const widgets = {
  ReferenceWidget,
  MultiReferenceWidget,
  StarRatingWidget,
};

const DynamicForm = ({ schema, modelKey, onSuccess }: any) => {
  const [formData, setFormData] = useState({});

  // Автоматически строим uiSchema на основе json_schema_extra
  const uiSchema: any = generateUiSchema(schema);

  const handleSubmit = ({ formData }: any) => {
    axios.post(`http://localhost:8000/models/${modelKey}/items`, formData)
      .then(() => {
        onSuccess();
        setFormData({});
      });
  };

  return (
    <Form
      schema={schema}
      formData={formData}
      onChange={e => setFormData(e.formData)}
      onSubmit={handleSubmit}
      validator={validator}
      widgets={widgets}
      uiSchema={uiSchema}
      className="mb-4"
    >
      <Button type="submit" variant="success">Создать / Обновить</Button>
    </Form>
  );
};

export default DynamicForm;
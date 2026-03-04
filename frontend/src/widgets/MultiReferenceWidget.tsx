import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import RelatedTable from '../components/RelatedTable'; // (см. ниже)

const ReferenceWidget = (props: any) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const refModel = props.schema['x-foreign-key'];

  const open = async () => {
    const res = await axios.get(`http://localhost:8000/models/${refModel}/items`);
    setData(res.data);
    setShow(true);
  };

  const select = (item: any) => {
    props.onChange(item.id);
    setShow(false);
  };

  return (
    <>
      <div className="mb-3">
        {/* <label>{props.label}</label> */}
        <div className="input-group">
          <input className="form-control" value={props.value || ''} readOnly />
          <Button variant="outline-primary" onClick={open}>Выбрать</Button>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Выбор {refModel}</Modal.Title></Modal.Header>
        <Modal.Body>
          <RelatedTable data={data} schema={props.schema} onSelect={select} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReferenceWidget;
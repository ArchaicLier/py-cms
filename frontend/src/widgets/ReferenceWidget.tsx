import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import RelatedTable from '../components/RelatedTable'; // (см. ниже)

const ReferenceWidget = (props: any) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [schema_, setSchema] = useState<any>();
  console.log("GAVNO", props)
  const refModel = props.schema['x-foreign-key'];

  const open = async () => {
    const res = await axios.get(`http://localhost:8000/models/${refModel}/items`);
    const res_s = await axios.get(`http://localhost:8000/models/${refModel}/schema`);

    setData(res.data);
    setSchema(res_s.data);
    console.log("ggwp", res_s.data)
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
          <input className="form-control" value={props.value?props.value:undefined} readOnly />
          <Button variant="outline-primary" onClick={open}>Выбрать</Button>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Выбор {refModel}</Modal.Title></Modal.Header>
        <Modal.Body>
          {
            schema_!=undefined?<RelatedTable data={data} schema={schema_} onSelect={select} />: <></>
          }
          
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReferenceWidget;
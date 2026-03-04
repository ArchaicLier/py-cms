import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = ({ models, current, onSelect }: any) => (
  <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
    <h5 className="p-3">Сущности</h5>
    <ListGroup variant="flush">
      {models.map((m: any) => (
        <ListGroup.Item
          key={m.key}
          active={m.key === current}
          action
          onClick={() => onSelect(m.key)}
        >
          {m.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

export default Sidebar;
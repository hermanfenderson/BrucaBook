import React from 'react';
import FormItemCatalog from '../containers/FormItemCatalog';
import {Modal, Button} from 'react-bootstrap';

const ModalGestioneItemCatalog = (props) => {
  return (
  <Modal show={props.showModal} onHide={props.close}>
   <Modal.Header closeButton>
        <Modal.Title>Aggiorna catalogo</Modal.Title>
        
      </Modal.Header>

      <Modal.Body>
      <FormItemCatalog onSubmitAction={props.onSubmitAction}/>
      </Modal.Body>

      <Modal.Footer>
        
      </Modal.Footer>

    </Modal>
  );
};

export default ModalGestioneItemCatalog;

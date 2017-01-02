import React from 'react';
import {Modal} from 'react-bootstrap';

const ModalSearching = (props) => {
  return (
  <Modal bsSize="small" show={props.showModal}>
      <Modal.Body>
      <span><img src='/loading.gif' alt="loading" className="img-responsive"/></span>
      </Modal.Body>

    </Modal>
  );
};

export default ModalSearching;

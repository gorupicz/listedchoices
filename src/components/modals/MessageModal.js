import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const MessageModal = ({ show, handleClose, isError, modalMessage, content = {}, title, confirmButtonText, cancelButtonText, onConfirm }) => {
  const defaultTitle = isError ? "Error" : "Information"; // Default titles
  const modalTitle = title || (isError ? content.errorModalTitle : content.verificationModalTitle) || defaultTitle;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="md"
      className="ltn__modal-area"
    >
      <Modal.Header>
        <Button onClick={handleClose} className="close" variant="secondary">
          <span aria-hidden="true">&times;</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="ltn__quick-view-modal-inner">
          <div className="modal-product-item">
            <div className="row">
              <div className="col-12">
                <div className="modal-product-info text-center">
                  <h4>{modalTitle}</h4>
                  <p className="added-cart">{modalMessage}</p>
                  <div className="btn-wrapper mt-0">
                    {cancelButtonText && (
                      <Button variant="secondary" onClick={handleClose}>
                        {cancelButtonText}
                      </Button>
                    )}
                    <Button className="theme-btn-1 btn btn-full-width-2" onClick={onConfirm || handleClose}>
                      {confirmButtonText || content.errorSuccessModalSubmit || "OK"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MessageModal; 
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const submitPhoneNumberModal = ({ show, handleClose, handleOnSubmit, phoneNumber, setPhoneNumber, content }) => {
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
                  <h4>{content.modalTitle}</h4>
                  <p className="added-cart">{content.modalDescription}</p>
                  <form onSubmit={handleOnSubmit} className="ltn__form-box">
                    <PhoneInput
                      country={'mx'}
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      inputProps={{
                        name: 'phoneNumber',
                        required: true,
                        autoFocus: true,
                      }}
                      placeholder={content.phonePlaceholder}
                      preferredCountries={['us', 'mx']}
                      enableSearch={true}
                      searchPlaceholder="Search country"
                      containerStyle={{
                        marginBottom: '0px !important'
                      }}
                      inputClass="form-input-box form-input-box-phone"
                      dropdownStyle={{
                        marginTop: '0px',
                        marginBottom: '0px',
                        textAlign: 'left',
                        paddingLeft: '18px',
                        li: {
                          marginTop: '0px !important',
                        }
                      }}
                    />
                    <div className="btn-wrapper mt-0">
                      <button className="theme-btn-1 btn btn-full-width-2" type="submit">
                        {content.modalSubmitButtonText}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default submitPhoneNumberModal; 
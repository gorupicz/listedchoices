import { Modal, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const CurrencyModal = ({ show, handleClose }) => {
  const { t } = useTranslation('components/modals/CurrencyModal');

  // Define supported currencies
  const currencies = [
    { code: 'USD', name: t('currencyUSD'), symbol: '$' },
    { code: 'MXN', name: t('currencyMXN'), symbol: '$' },
  ];

  const switchCurrency = (currencyCode) => {
    Cookies.set('currency', currencyCode, { expires: 365 });
    handleClose();
    window.location.reload(); // Reload to apply currency changes
  };

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
                  <h4>{t('heading')}</h4>
                  <div className="btn-wrapper mt-0">
                    {currencies.map(({ code, name, symbol }) => (
                      <Button
                        key={code}
                        variant="secondary"
                        className="social-btn language-btn btn-full-width-2 mb-10"
                        onClick={() => switchCurrency(code)}
                      >
                        {symbol} {name}
                      </Button>
                    ))}
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

export default CurrencyModal; 
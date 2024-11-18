import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaFlagUsa, FaFlag } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';


const LanguageModal = ({ show, handleClose }) => {
  const router = useRouter();
  const { t } = useTranslation('components/modals/LanguageModal');
  const switchLanguage = (lang) => {
    const currentLang = Cookies.get('i18next');
    if (currentLang !== lang) {
      // Remove any existing language prefix from the path
      const pathWithoutLang = router.asPath.replace(/^\/(en|es)(\/|$)/, '/');
      // Construct the new path with the selected language prefix
      const newPath = lang === 'en' ? `/en${pathWithoutLang}` : `/es${pathWithoutLang}`;
      // Force a full page reload to the new path
      window.location.href = newPath;
    }
    handleClose();
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
                    <Button variant="secondary" className="social-btn language-btn btn-full-width-2 mb-10" onClick={() => switchLanguage('en')}>
                        <span className="icon">🇺🇸</span> English
                    </Button>
                    <Button variant="secondary" className="social-btn language-btn btn-full-width-2" onClick={() => switchLanguage('es')}>
                        <span className="icon">🇲🇽</span> Español
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

export default LanguageModal;
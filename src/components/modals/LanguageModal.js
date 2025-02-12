import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const LanguageModal = ({ show, handleClose }) => {
  const router = useRouter();
  const { t } = useTranslation('components/modals/LanguageModal');

  // Define supported languages
  const languages = [
    { code: 'en', name: 'English', icon: '🇺🇸' },
    { code: 'es', name: 'Español', icon: '🇲🇽' },
    // Add more languages here
  ];

  async function switchLanguage (lang) {
    const currentLang = Cookies.get('i18next');
    if (currentLang !== lang) {
      //Change language in the client side
      Cookies.set('i18next', lang);
      const pathWithoutLang = router.asPath.replace(/^\/(en|es)(\/|$)/, '/');
      const newPath = `/${lang}${pathWithoutLang}`;
      window.location.href = newPath;
      // Update the session with the new language
      await fetch('/api/update-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: lang }),
      });
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
                    {languages.map(({ code, name, icon }) => (
                      <Button
                        key={code}
                        variant="secondary"
                        className="social-btn language-btn btn-full-width-2 mb-10"
                        onClick={() => switchLanguage(code)}
                      >
                        <span className="icon">{icon}</span> {name}
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

export default LanguageModal;
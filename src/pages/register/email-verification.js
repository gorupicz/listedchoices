import { useState } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ErrorSuccessModal from "@/components/modals/ErrorSuccessModal";

export async function getStaticProps({ locale }) {
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale
  return {
    props: {
      // Any other props you need
    },
  };
}
function EmailVerification() {
  const { t } = useTranslation('register/email-verification'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);  // Track if it's an error or success modal
  const [showModal, setShowModal] = useState(false);  // Modal state
  const router = useRouter();
  const { email } = router.query;  // Extract email from URL parameters

  // Modal functions to show and close modal
  const handleShowModal = (message, isError) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isError) {
      router.push('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      handleShowModal('Email is missing from the URL.', true);
      return;
    }

    const res = await fetch('/api/email-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code: verificationCode }),  // Use email from URL
    });

    if (res.ok) {
      handleShowModal(t('successMessage'), false);  // Show success modal
    } else {
      handleShowModal(t('errorMessage'), true);  // Show error modal
    }
  };

  return (
    <>
      <Layout topbar={false}>
        <div className="ltn__login-area pb-65 pt-20">
          <div className="container">
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center">
                  <h1 className="section-title">{t('pageTitle')}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="verificationCode"
                      placeholder={t('verificationCodePlaceholder')}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                    <div className="btn-wrapper mt-0 text-center">
                      <button className="email-btn social-btn btn" type="submit">
                        {t('submitButtonText')}
                      </button>
                    </div>
                  </form>
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/login"><b>{t('goBackToLoginText')}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>

      {/* Use the new ErrorSuccessModal component */}
      <ErrorSuccessModal
        show={showModal}
        handleClose={handleCloseModal}
        isError={isError}
        content={{
          errorModalTitle: t('errorModalTitle'),
          successModalTitle: t('successModalTitle'),
          modalSubmitText: t('modalSubmitText'),
          modalMessage: modalMessage
        }}
      />
    </>
  );
}

export default EmailVerification;

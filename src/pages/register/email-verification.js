import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ErrorSuccessModal from "@/components/modals/ErrorSuccessModal";
import Cookies from 'js-cookie';

function EmailVerification() {
  console.log('EmailVerification component mounted');
  const { t } = useTranslation('register/email-verification'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [title, setTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [submitText, setSubmitText] = useState('');
  const [isError, setIsError] = useState(false);  // Track if it's an error or success modal
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);  // Modal state
  const router = useRouter();
  const email = router.query.email;  // Extract email from URL parameters as a string
  // Modal functions to show and close modal
  const handleShowModal = (title, message, submitText, isError, isVerified) => {
    setTitle(title);
    setModalMessage(message);
    setSubmitText(submitText);
    setIsError(isError);
    setShowModal(true);
    setIsVerified(isVerified);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if ((isError && isVerified !== true) || (!isError && isVerified === true)) {
      router.push('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      handleShowModal(t(errorModalTitle),'Email is missing from the URL.',t(modalSubmitText), true, false);
      return;
    }

    const res = await fetch('/api/email-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': Cookies.get('i18next') || 'en',
      },
      body: JSON.stringify({ email, code: verificationCode }),  // Use email from URL
    });

    if (res.ok) {
      handleShowModal(t('successModalTitle'),t('successMessage'),t('goBackToLoginText'), false, true);  // Show success modal
    } else {
      handleShowModal(t('errorModalTitle'),t('errorMessage'),t('modalSubmitText'), true, false);  // Show error modal
    }
  };

  useEffect(() => {
    let isMounted = true; // Flag to ensure the effect runs only once

    if (email && isMounted) {
      const verifyEmail = async () => {
        const res = await fetch('/api/email-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': Cookies.get('i18next') || 'en',
          },
          body: JSON.stringify({ 
            email: email,  // Use email from URL
            subject: t('verificationEmailSubject'),  // Add email subject
            body: t('verificationEmailBody')  // Add email body
          }),
        });

        if (res.ok) {
          handleShowModal(t('verificationModalTitle'), t('verificationCodeSentMessage'), t('modalSubmitText'), false, false);  // Show success modal
        } else {
          handleShowModal(t('errorModalTitle'),'There is a problem with the email verification process. Please try again later.',t('modalSubmitText'), true, false);  // Show error modal
        }
      };

      verifyEmail();
    }

    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
  }, []);  // Ensure this runs only once on initial load

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
        content={{
          title: title,
          submitText: submitText,
          message: modalMessage
        }}
      />
    </>
  );
}

export default EmailVerification;

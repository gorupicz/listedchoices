import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import SubmitPhoneNumberModal from "@/components/modals/submitPhoneNumberModal";
import ErrorSuccessModal from "@/components/modals/ErrorSuccessModal";
import { signOut, getSession, useSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const { locale } = context;
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale

  const session = await getSession(context);

  if (!session || session.user.phoneIsVerified === true) {
    return {
      redirect: {
        destination: '/history',
        permanent: false,
      },
    };
  }
  return {
    props: { user: session.user },
  };
}

function PhoneVerification({ user }) {
  const { t } = useTranslation('register/phone-verification'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(true); // Show phone verification modal initially
  const router = useRouter();

  useEffect(() => {
    setShowPhoneVerificationModal(true); // Show the phone verification modal when the page loads
  }, []);

  // Modal functions to show and close modal
  const handleShowModal = (message, isError) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isError) {
      router.push('/register/identity-verification');
    }
  };

  const handlePhoneVerification = async (e) => {
    e.preventDefault();

    console.log('Sending phone number:', phoneNumber); // Debugging log

    // Send OTP to the phone number using Twilio
    const res = await fetch('/api/phone-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, userId: user.id }), // Use user.id from props
    });
    if (res.ok) {
      setShowPhoneVerificationModal(false); // Close the phone verification modal
    } else {
      setShowPhoneVerificationModal(false);
      if (res.status === 400) {//Phone number is required
        handleShowModal(t('otpSendErrorMessage'), true);
      }
      else if (res.status === 401) {//token expired or unauthorized
        handleShowModal(t('otpSendErrorMessage'), true);
      }
      else if (res.status === 404) { //user not found
        handleShowModal(t('otpSendErrorMessage'), true);
      }
      else if (res.status === 405) {//method not allowed
        handleShowModal(t('otpSendErrorMessage'), true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the OTP
    const res = await fetch('/api/phone-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: verificationCode, userId: user.id }),
    });

    if (res.ok) {
      handleShowModal(t('successMessage'), false);
    } else {
      handleShowModal(t('errorMessage'), true);
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

      <SubmitPhoneNumberModal
        show={showPhoneVerificationModal}
        handleClose={handleCloseModal}
        handleOnSubmit={handlePhoneVerification}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        content={{
          modalTitle: t('phoneVerificationModalTitle'),
          modalDescription: t('phoneVerificationModalDescription'),
          phonePlaceholder: t('phoneNumberPlaceholder'),
          modalSubmitButtonText: t('sendVerificationCodeButton')
        }}
      />
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

export default PhoneVerification;

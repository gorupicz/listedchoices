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
import { getSession } from "next-auth/react";
import Cookies from 'js-cookie';
import prisma from '@/lib/prisma'; // Import your Prisma client 

export async function getServerSideProps(context) {
  const { locale } = context;
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale

  const session = await getSession(context);

    if (session) {
        // Query the database for the latest user information
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                isVerified: true,
                phoneIsVerified: true,
                idIsVerified: true,
                idPhotograph: true,
                // Add any other fields you need
            },
        });

        return {
            props: { user },
        };
    }
    return {
        props: { user: null },
    };
}

function PhoneVerification({ user }) {
  const router = useRouter();

  if (!user || user.phoneIsVerified) {
    const redirectPath = !user ? '/register' : '/accreditation';
    if (!user) {
      Cookies.set('redirectAfterAuthenticated', window.location.pathname, { expires: 1, path: '/' });
    }
    router.push(redirectPath);
    return;
  }

  const { t } = useTranslation('register/phone-verification'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(true); // Show phone verification modal initially
  const [title, setTitle] = useState('');
  const [submitText, setSubmitText] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setShowPhoneVerificationModal(true); // Show the phone verification modal when the page loads
  }, []);

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
    if (!isError) {
      router.push('/register/id-verification');
    }
  };

  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    // Send OTP to the phone number using Twilio
    const res = await fetch('/api/phone-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': Cookies.get('i18next') || 'en',
      },
      body: JSON.stringify({ phoneNumber, userId: user.id }), // Use user.id from props
    });
    if (res.ok) {
      setShowPhoneVerificationModal(false); // Close the phone verification modal
    } else {
      setShowPhoneVerificationModal(false);
      if (res.status === 400) {//Phone number is required
        handleShowModal(t('errorModalTitle'), t('otpSendErrorMessage'), t('modalSubmitText'), true, false);
      }
      else if (res.status === 401) {//token expired or unauthorized
        handleShowModal(t('errorModalTitle'), t('otpSendErrorMessage'), t('modalSubmitText'), true, false);
      }
      else if (res.status === 404) { //user not found
        handleShowModal(t('errorModalTitle'), t('otpSendErrorMessage'), t('modalSubmitText'), true, false);
      }
      else if (res.status === 405) {//method not allowed
        handleShowModal(t('errorModalTitle'), t('otpSendErrorMessage'), t('modalSubmitText'), true, false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/phone-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': Cookies.get('i18next') || 'en',
      },
      body: JSON.stringify({ code: verificationCode, userId: user.id }),
    });

    if (res.ok) {
      handleShowModal(t('successModalTitle'), t('successMessage'), t('modalSubmitText'), false, true);
    } else {
      handleShowModal(t('errorModalTitle'), t('errorMessage'), t('modalSubmitText'), true, false);
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
          modalSubmitButtonText: t('sendVerificationCodeButtonText')
        }}
      />
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

export default PhoneVerification;

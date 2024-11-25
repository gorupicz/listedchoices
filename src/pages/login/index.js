import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react'; // Import both signIn and useSession
import { FcGoogle } from "react-icons/fc"; // Import FcGoogle for original colors
import { FaFacebook } from "react-icons/fa"; // Import FaFacebook
import { FaEnvelope } from 'react-icons/fa'; // Import the icon
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import MessageModal from "@/components/modals/MessageModal";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export async function getStaticProps({ locale }) {
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale
  return {
    props: {
      // Any other props you need
    },
  };
}


function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

function Login() {
  const { t } = useTranslation('login'); // Loads src/data/login/{{lng}}/index.json

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');  // For showing messages in modal
  const [isError, setIsError] = useState(false);  // Track if it's an error message
  const [showModal, setShowModal] = useState(false);  // Modal state
  const [reopenForgotPassword, setReopenForgotPassword] = useState(false); // To track reopening Forgot Password modal
  const { data: session, status } = useSession(); // Get session and status
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false); // New state for login form visibility
  const [hasRedirected, setHasRedirected] = useState(false);

  const modalPasswordContent = {
    modalTitle: t('modalTitle'),
    modalDescription: t('modalDescription'),
    emailPlaceholder: t('emailPlaceholder'),
    modalSubmitButtonText: t('modalSubmitButtonText')
  };

  const modalMessageContent = {
    errorModalTitle: t('errorModalTitle'),
    verificationModalTitle: t('verificationModalTitle'),
    errorSuccessModalSubmit: t('errorSuccessModalSubmit'),
  };

  // Check if the user is authenticated via Google or regular flow
  useEffect(() => {
    if (status === 'authenticated' && !hasRedirected) {
      if (session?.user?.isVerified) {
        const redirectUrl = getCookie('redirectAfterAuthenticated');
        if (redirectUrl) {
          router.push(redirectUrl);
          setHasRedirected(true);
        } else {
          router.push('/my-account');
        }
      }
    }
  }, [session, status, router, hasRedirected]);

  // Function to close all modals
  const handleCloseAllModals = () => {
    setShowForgotPassword(false);
    setShowModal(false);
  };

  // Function to show error/success modal
  const handleShowModal = (message, isError, reopenForgotPassword = false) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
    if (reopenForgotPassword) {
      setReopenForgotPassword(true);
    }
  };

  // Close the error/success modal and optionally reopen Forgot Password modal
  const handleCloseModal = () => {
    setShowModal(false);
    if (reopenForgotPassword) {
      setShowForgotPassword(true);
      setReopenForgotPassword(false);  // Reset state
    }
    if (!isError) {
      // Redirect to email verification only if the action was related to verification
      if (modalMessage === t('verificationCodeSentMessage')) {
        router.push(`/register/email-verification?email=${email}`);
      }
    }
  };

  const handleCloseForgotPassword = () => setShowForgotPassword(false);
  const handleShowForgotPassword = () => setShowForgotPassword(true);

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    const cleanedEmail = validator.trim(email);

    if (!validator.isEmail(cleanedEmail)) {
      // Close Forgot Password modal and show error modal
      handleCloseForgotPassword();
      handleShowModal(t('invalidEmailMessage'), true, true);
      return;
    }

    // Send recovery email request
    const res = await fetch('/api/password-recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: cleanedEmail,
      }),
    });

    if (res.ok) {
      handleCloseForgotPassword();  // Close the modal after submission
      handleShowModal(t('passwordRecoverySentMessage'), false);  // Show recovery success message
    } else {
      handleCloseForgotPassword();
      handleShowModal(t('defaultErrorMessage'), true);
    }
  };

  const handleGoogleSignIn = () => {
  signIn('google', { prompt: 'select_account' });
};

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      handleShowModal(t('invalidEmailMessage'), true);  // Show invalid email modal
      return;
    }

    console.log('Executing reCAPTCHA...');
    const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'login' });

    if (!token) {
      handleShowModal(t('recaptchaErrorMessage'), true);
      return;
    }

    try {
      console.log('Sending login request...');
      const result = await signIn('credentials', {
        email: cleanedEmail,
        password,
        recaptchaToken: token, // Send reCAPTCHA token
        redirect: false // Ensure no automatic redirect
      });

      console.log('Login result:', result); // Log the result

      if (result.status === 401) {
        handleShowModal(t('errorInvalidEmailOrPasswordModalMessage'), true);  // Show error modal
      } else if (result.error === '203') {
        handleShowModal(t('verificationCodeSentMessage'), false);
      } else if (!hasRedirected) {
        const redirectUrl = getCookie('redirectAfterAuthenticated');
        if (redirectUrl) {
          router.push(redirectUrl);
          setHasRedirected(true);
        } else {
          router.push('/my-account');
        }
      }
    } catch (error) {
      handleShowModal(t('defaultErrorMessage'), true);  // Show error modal
    }
  };

  return (
    <>
      <Layout topbar={false}>
        <div className="ltn__login-area pb-110 pt-20">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center mb-10">
                  <h1 className="section-title">{t('pageTitle')}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box">
                  <div className="text-center">
                    <Button 
                      className="social-btn google-btn" 
                      onClick={handleGoogleSignIn}
                    >
                      <span className="icon"><FcGoogle /></span> {t('googleSignInButtonLabel')}
                    </Button>
                    {/* <Button 
                      className="social-btn facebook-btn" 
                      onClick={() => signIn('facebook')}
                    >
                      <span className="icon"><FaFacebook /></span> {t('facebookSignInButtonLabel')}
                    </Button> */}
                    <p className="separator checkbox-inline mt-10 mb-10"><small>{t('socialSignInOr')}</small></p>
                  </div>
                  {!showLoginForm && (
                    <div className="text-center">
                      <Button 
                        className="social-btn email-btn" 
                        onClick={() => setShowLoginForm(true)}
                      >
                        <span className="icon"><FaEnvelope /></span> {t('continueWithEmailButtonLabel')}
                      </Button>
                      <p>
                        <Link href="" className="go-to-btn" onClick={handleShowForgotPassword}>
                          <small>{t('forgotPasswordText')}</small>
                        </Link>
                      </p>
                    </div>
                  )}
                  {showLoginForm && (
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="email"
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder={t('passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-center">
                        <Link href="" className="go-to-btn" onClick={handleShowForgotPassword}>
                          <small>{t('forgotPasswordText')}</small>
                        </Link>
                      </p>
                      <div className="btn-wrapper mt-0 text-center">
                        <button className="email-btn social-btn btn" type="submit">
                          {t('signInButtonText')}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/register"><b>{t('dontHaveAccountText')}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>

      <ForgotPasswordModal
        show={showForgotPassword}
        handleClose={handleCloseForgotPassword}
        handlePasswordRecovery={handlePasswordRecovery}
        email={email}
        setEmail={setEmail}
        content={modalPasswordContent}
      />

      <MessageModal
        show={showModal}
        handleClose={handleCloseModal}
        isError={isError}
        modalMessage={modalMessage}
        content={modalMessageContent}
      />
    </>
  );
}

export default Login;

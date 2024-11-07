import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CallToAction from "@/components/callToAction";
import Link from "next/link";
import loginData from "@/data/login/index.json";  // Import text content
import { signIn, useSession } from 'next-auth/react'; // Import both signIn and useSession
import { FcGoogle } from "react-icons/fc"; // Import FcGoogle for original colors
import { FaFacebook } from "react-icons/fa"; // Import FaFacebook
import { FaEnvelope } from 'react-icons/fa'; // Import the icon
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import MessageModal from "@/components/modals/MessageModal";

function Login() {
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

  // Check if the user is authenticated via Google or regular flow
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isVerified) {
        // Redirect to the dashboard if the user is verified
        router.push('/my-account');
      }
    }
  }, [session, status, router]);

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
    console.log('Modal message:', modalMessage);
    console.log('Is error:', isError);
    if (!isError) {
      // Redirect to email verification only if the action was related to verification
      if (modalMessage === loginData.verificationCodeSentMessage) {
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
      handleShowModal(loginData.invalidEmailMessage, true, true);
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
        subject: loginData.recoveryEmailSubject,
        body: loginData.recoveryEmailBody
      }),
    });

    if (res.ok) {
      handleCloseForgotPassword();  // Close the modal after submission
      handleShowModal(loginData.passwordRecoverySentMessage, false);  // Show recovery success message
    } else {
      handleCloseForgotPassword();
      handleShowModal(loginData.defaultErrorMessage, true);
    }
  };

  const handleGoogleSignIn = () => {
  signIn('google', { prompt: 'select_account' });
};

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      handleShowModal(loginData.invalidEmailMessage, true);  // Show invalid email modal
      return;
    }

    console.log('Executing reCAPTCHA...');
    const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'login' });

    if (!token) {
      handleShowModal(loginData.recaptchaErrorMessage, true);
      return;
    }

    try {
      console.log('Sending login request...');
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          subject: loginData.verificationEmailSubject, 
          body: loginData.verificationEmailSubject,
          recaptchaToken: token, // Send reCAPTCHA token
        }),
      });

      console.log('Login request sent, awaiting response...');
      const data = await res.json();
      console.log('Response received:', data);

      if (res.ok) {
        console.log('Token received:', data.token); // Log the received token
        localStorage.setItem('authToken', data.token); // Store the token
        if (data.isVerified) {
          console.log('User is verified, redirecting to dashboard...');
          router.push('/my-account');
        } else {
          console.log('User is not verified, showing verification modal...');
          handleShowModal(loginData.verificationCodeSentMessage, false);
        }
      } else {
        console.log('Login failed, showing error modal...');
        handleShowModal(data.message || loginData.defaultErrorMessage, true);  // Show error modal
      }
    } catch (error) {
      console.error('Login error:', error);
      handleShowModal(loginData.defaultErrorMessage, true);  // Show error modal
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
                  <h1 className="section-title">{loginData.pageTitle}</h1>
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
                      <span className="icon"><FcGoogle /></span> {loginData.googleSignInButtonLabel}
                    </Button>
                    <Button 
                      className="social-btn facebook-btn" 
                      onClick={() => signIn('facebook')}
                    >
                      <span className="icon"><FaFacebook /></span> {loginData.facebookSignInButtonLabel}
                    </Button>
                    <p className="separator checkbox-inline mt-10 mb-10"><small>{loginData.socialSignInOr}</small></p>
                  </div>
                  {!showLoginForm && (
                    <div className="text-center">
                      <Button 
                        className="social-btn email-btn" 
                        onClick={() => setShowLoginForm(true)}
                      >
                        <span className="icon"><FaEnvelope /></span> {loginData.continueWithEmailButtonLabel}
                      </Button>
                    </div>
                  )}
                  {showLoginForm && (
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="email"
                        placeholder={loginData.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder={loginData.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p>
                        <Link href="" className="go-to-btn" onClick={handleShowForgotPassword}>
                          <small>{loginData.forgotPasswordText}</small>
                        </Link>
                      </p>
                      <div className="btn-wrapper mt-0 text-center">
                        <button className="email-btn social-btn btn" type="submit">
                          {loginData.signInButtonText}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/register"><b>{loginData.dontHaveAccountText}</b></Link>
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
        loginData={loginData}
      />

      <MessageModal
        show={showModal}
        handleClose={handleCloseModal}
        isError={isError}
        modalMessage={modalMessage}
        loginData={loginData}
      />
    </>
  );
}

export default Login;

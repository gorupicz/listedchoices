import { useState } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CallToAction from "@/components/callToAction";
import Link from "next/link";
import loginData from "@/data/login/index.json";  // Import text content

function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');  // For showing messages in modal
  const [isError, setIsError] = useState(false);  // Track if it's an error message
  const [showModal, setShowModal] = useState(false);  // Modal state
  const [reopenForgotPassword, setReopenForgotPassword] = useState(false); // To track reopening Forgot Password modal
  const router = useRouter();

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
      router.push(`/register/email-verification?email=${email}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      handleShowModal(loginData.invalidEmailMessage, true);  // Show invalid email modal
      return;
    }

    // Send login request to check if credentials are correct
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        subject: loginData.verificationEmailSubject, 
        body: loginData.verificationEmailSubject 
      }),
    });

    const data = await res.json();

    // First check if email and password are correct
    if (res.ok) {
      if (data.isVerified) {
        // If verified, proceed to dashboard
        router.push('/dashboard');
      } else {
        // If not verified, show the modal and send the user to verification page
        handleShowModal(loginData.verificationCodeSentMessage, false);
      }
    } else {
      // Show error if email/password is incorrect
      handleShowModal(data.message || loginData.defaultErrorMessage, true);  // Show error modal
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
                  <h1 className="section-title">{loginData.pageTitle}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box">
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
                      <button className="theme-btn-1 btn btn-block" type="submit">
                        {loginData.signInButtonText}
                      </button>
                    </div>
                  </form>
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/register"><b>{loginData.dontHaveAccountText}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
          <Container>
            <Row>
              <Col xs={12}>
                <CallToAction />
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>

      {/* Modal for Forget Password */}
      <Modal
        show={showForgotPassword}
        onHide={handleCloseForgotPassword}
        backdrop="static"
        keyboard={false}
        size="md"
        className="ltn__modal-area"
      >
        <Modal.Header>
          <Button onClick={handleCloseForgotPassword} className="close" variant="secondary">
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="ltn__quick-view-modal-inner">
            <div className="modal-product-item">
              <div className="row">
                <div className="col-12">
                  <div className="modal-product-info text-center">
                    <h4>{loginData.modalTitle}</h4>
                    <p className="added-cart">{loginData.modalDescription}</p>
                    <form onSubmit={handlePasswordRecovery} className="ltn__form-box">
                      <input
                        type="text"
                        name="email"
                        placeholder={loginData.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="btn-wrapper mt-0">
                        <button className="theme-btn-1 btn btn-full-width-2" type="submit">
                          {loginData.modalSubmitButtonText}
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

      {/* Modal for showing success/error messages */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="md"
        className="ltn__modal-area"
      >
        <Modal.Header>
          <Button onClick={handleCloseModal} className="close" variant="secondary">
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="ltn__quick-view-modal-inner">
            <div className="modal-product-item">
              <div className="row">
                <div className="col-12">
                  <div className="modal-product-info text-center">
                    <h4>{isError ? loginData.errorModalTitle : emailVerificationData.successModalTitle}</h4>
                    <p className="added-cart">{modalMessage}</p>
                    <div className="btn-wrapper mt-0">
                      <Button className="theme-btn-1 btn btn-full-width-2" onClick={handleCloseModal}>
                        {loginData.errorSuccessModalSubmit}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
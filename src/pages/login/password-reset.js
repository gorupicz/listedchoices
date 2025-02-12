import { useState } from "react";
import { useRouter } from 'next/router';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength
import validator from 'validator';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import loginData from "@/data/login/password-reset.json";  // Import the text content
import Cookies from 'js-cookie';

function PasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);  // Password strength state
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);  // Track if it's an error or success modal
  const [showModal, setShowModal] = useState(false);  // Modal state
  const router = useRouter();
  const { token } = router.query;  // Get the token from the URL

  // Function to calculate password strength
  function getPasswordStrength(password) {
    const result = zxcvbn(password);
    return result.score;  // 0 (weak) to 4 (very strong)
  }

  // Modal functions to show and close modal
  const handleShowModal = (message, isError) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isError) {
      router.push('/login');  // Redirect to login on success
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      handleShowModal(loginData.errorPasswordMismatch, true);
      return;
    }

    if (newPassword.length < 8) {
      handleShowModal(loginData.errorPasswordLength, true);
      return;
    }

    const res = await fetch('/api/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': Cookies.get('i18next') || 'en',

      },
      body: JSON.stringify({ 
        token, 
        newPassword }),
    });

    if (res.ok) {
      handleShowModal(loginData.successPasswordReset, false);  // Show success modal
    } else {
      handleShowModal(loginData.defaultErrorMessage, true);  // Show error modal
    }
  };

  // Handle password input changes and update strength
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    const strength = getPasswordStrength(value);  // Get strength score
    setPasswordStrength(strength);  // Update password strength
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
                    <div className="passwordInputContainer">
                      <input
                        type="password"
                        name="newPassword"
                        placeholder={loginData.newPasswordPlaceholder}
                        value={newPassword}
                        onChange={handlePasswordChange}  // Handle password changes and strength
                        required
                      />
                      {/* Display password strength only when user starts typing */}
                      {newPassword && (
                        <p className="passwordStrength">
                          <small>{loginData.passwordStrengthLabel}: {loginData.passwordStrengthLabels[passwordStrength]}</small>
                        </p>
                      )}
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder={loginData.confirmPasswordPlaceholder}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="btn-wrapper mt-0 text-center">
                      <button className="email-btn social-btn btn" type="submit">
                        {loginData.resetButtonText}
                      </button>
                    </div>
                  </form>
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/login"><b>{loginData.goBackToLoginText}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>

      {/* Modal for error/success messages */}
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
                    <h4>{isError ? loginData.errorModalTitle : loginData.successModalTitle}</h4>
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

export default PasswordReset;
import { useState } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import verificationData from "@/data/register/email-verification.json";  // Import verification data

function EmailVerification() {
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
      handleShowModal(verificationData.successMessage, false);  // Show success modal
    } else {
      handleShowModal(verificationData.errorMessage, true);  // Show error modal
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
                  <h1 className="section-title">{verificationData.pageTitle}</h1>
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
                      placeholder={verificationData.verificationCodePlaceholder}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                    <div className="btn-wrapper mt-0 text-center">
                      <button className="email-btn social-btn btn" type="submit">
                        {verificationData.submitButtonText}
                      </button>
                    </div>
                  </form>
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/login"><b>{verificationData.goBackToLoginText}</b></Link>
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
                    <h4>{isError ? verificationData.errorModalTitle : verificationData.successModalTitle}</h4>
                    <p className="added-cart">{modalMessage}</p>
                    <div className="btn-wrapper mt-0">
                      <Button className="theme-btn-1 btn btn-full-width-2" onClick={handleCloseModal}>
                        {verificationData.modalSubmitText}
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

export default EmailVerification;

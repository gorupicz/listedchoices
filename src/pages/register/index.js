import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import zxcvbn from 'zxcvbn';
import { Layout } from "@/layouts";
import registerData from "@/data/register/index.json";
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CallToAction from "@/components/callToAction";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEnvelope } from 'react-icons/fa';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if the user is authenticated via Google or regular flow
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isVerified) {
        // Redirect to the dashboard if the user is verified
        router.push('/my-account');
      } else {
        // Redirect to email verification if the user is not verified
        router.push(`/register/email-verification?email=${session.user.email}`);
      }
    }
  }, [session, status, router]);

  function getPasswordStrength(password) {
    const result = zxcvbn(password);
    return result.score; // 0 (weak) to 4 (very strong)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      handleShowModal(registerData.invalidEmailMessage, true);
      return;
    }
    
    if (password !== confirm_password) {
      handleShowModal(registerData.passwordsDoNotMatchMessage, true);
      return;
    }

    if (passwordStrength < 2) {  // Set minimum acceptable strength
      handleShowModal(registerData.weakPasswordMessage, true);
      return;
    }

    const cleanedFirstName = validator.trim(first_name);
    const cleanedLastName = validator.trim(last_name);

    // Execute reCAPTCHA v3
    const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'register' });

    if (!token) {
      handleShowModal(registerData.recaptchaErrorMessage, true);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanedEmail,
          password,
          first_name: cleanedFirstName,
          last_name: cleanedLastName,
          subject: registerData.verificationEmailSubject,
          body: registerData.verificationEmailBody,
          recaptchaToken: token,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Open modal saying the code was sent
        handleShowModal(registerData.verificationCodeSentMessage, false);
      } else {
        handleShowModal(data.message || registerData.defaultErrorMessage, true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      handleShowModal(registerData.defaultErrorMessage, true);
    }
  };

  // Handle password input changes and update strength
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setShowConfirmPassword(value.length > 0);
    const strength = getPasswordStrength(value);
    setPasswordStrength(strength);
  };

  // Modal functions to show and close modal
  const handleShowModal = (message, isError) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (!isError) {
      if (session && session.user && session.user.isVerified) {
        // If user is authenticated and verified, redirect to dashboard
        router.push('/my-account');
      } else {
        // If not verified, redirect to email verification page
        router.push(`/register/email-verification?email=${email}`);
      }
    }
  };

  return (
    <>
      <Layout topbar={false}>
        <div className="ltn__login-area pb-110 pt-20">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center mb-30">
                  <h1 className="section-title">{registerData.title}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box pt-10">
                  <div className="text-center">
                    <Button className="google-btn" style={{ width:'100%' }} variant="primary" onClick={() => {
                      signIn('google', { prompt: 'select_account' });
                    }}>
                      <span className="icon"><FcGoogle /></span> {registerData.googleSignUpButtonLabel}
                    </Button>
                    <Button className="facebook-btn" style={{ width:'100%', marginTop: '10px' }} variant="primary" onClick={() => {
                      signIn('facebook');
                    }}>
                      <span className="icon"><FaFacebook /></span> {registerData.facebookSignUpButtonLabel}
                    </Button>
                    <p className="separator checkbox-inline mt-10 mb-10"><small>{registerData.socialSignUpOr}</small></p>
                  </div>
                  {!showRegisterForm && (
                    <div className="text-center">
                    <Button className="continue-email-btn btn mb-10" style={{ width:'100%' }} onClick={() => setShowRegisterForm(!showRegisterForm)}>
                      <span className="icon"><FaEnvelope /></span> {registerData.continueWithEmailButtonLabel}
                    </Button>
                  </div>
                  )}
                  {showRegisterForm && (
                    <form onSubmit={handleSubmit}>
                      <Row>
                        <Col xs={12} md={6}>
                          <input
                            type="text"
                            name="first_name"
                            placeholder={registerData.firstNamePlaceholder}
                            value={first_name}
                            onChange={(e) => setFirstName(validator.trim(e.target.value))}
                            required
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <input
                            type="text"
                            name="last_name"
                            placeholder={registerData.lastNamePlaceholder}
                            value={last_name}
                            onChange={(e) => setLastName(validator.trim(e.target.value))}
                            required
                          />
                        </Col>
                      </Row>
                      <input 
                        type="text" 
                        name="email" 
                        placeholder={registerData.emailPlaceholder} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <div className="passwordInputContainer">
                        <input
                          type="password"
                          name="password"
                          placeholder={registerData.passwordPlaceholder}
                          value={password}
                          onChange={handlePasswordChange}  // Use the password handler
                          required
                        />
                        {password && (
                          <p className="passwordStrength">
                            <small>{registerData.passwordStrengthLabel}: {registerData.passwordStrengthLabels[passwordStrength]}</small>
                          </p>
                        )}
                      </div>

                      {/* Conditionally render the Confirm Password field */}
                      {showConfirmPassword && (
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder={registerData.confirmPasswordPlaceholder}
                          value={confirm_password}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      )}
                      <div className="btn-wrapper text-center mt-0">
                        <label className="checkbox-inline mb-10">
                          {registerData.privacyPolicyConsentText}
                        </label>
                        <button className="continue-email-btn btn btn-block" type="submit">
                          {registerData.createAccountButton}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/login"><b>{registerData.alreadyHaveAccountText}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>

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
                    <h4>{isError ? registerData.errorModalTitle : registerData.successModalTitle}</h4>
                    <p className="added-cart">{modalMessage}</p>
                    <div className="btn-wrapper mt-0">
                      <Button className="theme-btn-1 btn btn-full-width-2" onClick={handleCloseModal}>
                        {registerData.errorSuccessModalSubmit}
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

export default Register;

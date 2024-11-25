import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import zxcvbn from 'zxcvbn';
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEnvelope } from 'react-icons/fa';
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

function Register() {
  const { t } = useTranslation('register'); // Loads src/data/register/{{lng}}/index.json
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
  const [hasRedirected, setHasRedirected] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }
  
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
      } else {
        router.push(`/register/email-verification?email=${session.user.email}`);
      }
    }
  }, [session, status, router, hasRedirected]);

  function getPasswordStrength(password) {
    const result = zxcvbn(password);
    return result.score; // 0 (weak) to 4 (very strong)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      handleShowModal(t('invalidEmailMessage'), true);
      return;
    }
    
    if (password !== confirm_password) {
      handleShowModal(t('passwordsDoNotMatchMessage'), true);
      return;
    }

    if (passwordStrength < 2) {  // Set minimum acceptable strength
      handleShowModal(t('weakPasswordMessage'), true);
      return;
    }

    const cleanedFirstName = validator.trim(first_name);
    const cleanedLastName = validator.trim(last_name);

    const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'register' });

    if (!token) {
      handleShowModal(t('recaptchaErrorMessage'), true);
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
          subject: t('verificationEmailSubject'),
          body: t('verificationEmailBody'),
          recaptchaToken: token,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        handleShowModal(t('verificationCodeSentMessage'), false);
      } else {
        handleShowModal(data.message || t('defaultErrorMessage'), true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      handleShowModal(t('defaultErrorMessage'), true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setShowConfirmPassword(value.length > 0);
    const strength = getPasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleGoogleSignUp = () => {
    signIn('google', { prompt: 'select_account' });
  };

  const handleShowModal = (message, isError) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (!isError && !hasRedirected) {
      if (session && session.user && session.user.isVerified) {
        const redirectUrl = getCookie('redirectAfterAuthenticated');
        if (redirectUrl) {
          router.push(redirectUrl);
          setHasRedirected(true);
        } else {
          router.push('/my-account');
        }
      } else {
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
                  <h1 className="section-title">{t('title')}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box pt-10">
                  <div className="text-center">
                    <Button 
                      className="social-btn google-btn" 
                      onClick={handleGoogleSignUp}
                    >
                      <span className="icon"><FcGoogle /></span> {t('googleSignUpButtonLabel')}
                    </Button>
                    {/* <Button 
                      className="social-btn facebook-btn" 
                      onClick={() => signIn('facebook')}
                    >
                      <span className="icon"><FaFacebook /></span> {t('facebookSignUpButtonLabel')}
                    </Button> */}
                    <p className="separator checkbox-inline mt-10 mb-10"><small>{t('socialSignUpOr')}</small></p>
                  </div>
                  {!showRegisterForm && (
                    <div className="text-center">
                      <Button 
                        className="social-btn email-btn" 
                        onClick={() => setShowRegisterForm(!showRegisterForm)}
                      >
                        <span className="icon"><FaEnvelope /></span> {t('continueWithEmailButtonLabel')}
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
                            placeholder={t('firstNamePlaceholder')}
                            value={first_name}
                            onChange={(e) => setFirstName(validator.trim(e.target.value))}
                            required
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <input
                            type="text"
                            name="last_name"
                            placeholder={t('lastNamePlaceholder')}
                            value={last_name}
                            onChange={(e) => setLastName(validator.trim(e.target.value))}
                            required
                          />
                        </Col>
                      </Row>
                      <input 
                        type="text" 
                        name="email" 
                        placeholder={t('emailPlaceholder')} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <div className="passwordInputContainer">
                        <input
                          type="password"
                          name="password"
                          placeholder={t('passwordPlaceholder')}
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        {password && (
                          <p className="passwordStrength">
                            <small>{t('passwordStrengthLabel')}: {t('passwordStrengthLabels')[passwordStrength]}</small>
                          </p>
                        )}
                      </div>

                      {showConfirmPassword && (
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder={t('confirmPasswordPlaceholder')}
                          value={confirm_password}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      )}
                      <div className="btn-wrapper text-center mt-0">
                        <label className="checkbox-inline mb-10">
                          {t('privacyPolicyConsentText')}
                        </label>
                        <button className="email-btn social-btn btn" type="submit">
                          {t('createAccountButton')}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="by-agree text-center mt-20 border-top">
                    <div className="go-to-btn mt-20">
                      <Link href="/login"><b>{t('alreadyHaveAccountText')}</b></Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>

      <MessageModal
        show={showModal}
        handleClose={handleCloseModal}
        isError={isError}
        modalMessage={modalMessage}
        loginData={t}
      />
    </>
  );
}

export default Register;

import { useState } from "react";
import { useRouter } from 'next/router';
import validator from 'validator';
import zxcvbn from 'zxcvbn';
import { Layout } from "@/layouts";
import registerData from "@/data/register/index.json";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPlay,
  FaSearch,
  FaRegEnvelopeOpen,
  FaPhoneAlt,
} from "react-icons/fa";

import ShopBreadCrumb from "@/components/breadCrumbs/shop";

import CallToAction from "@/components/callToAction";
import Link from "next/link";
import Image from "next/image";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // for password strength meter
  const router = useRouter();

  function getPasswordStrength(password) {
    const result = zxcvbn(password);
    return result.score; // 0 (weak) to 4 (very strong)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = validator.trim(email);
    if (!validator.isEmail(cleanedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    if (password !== confirm_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (passwordStrength < 2) {  // Set minimum acceptable strength
      setErrorMessage('Password is too weak. Please make it stronger.');
      return;
    }


    const cleanedFirstName = validator.trim(first_name);
    const cleanedLastName = validator.trim(last_name);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanedEmail,
        password,
        first_name: cleanedFirstName,
        last_name: cleanedLastName
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // Handle success (e.g., redirect to login)
      router.push('/login');
    } else {
      setErrorMessage(data.message || 'Something went wrong');
    }
  };

  // Handle password input changes and update strength
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const strength = getPasswordStrength(value);  // Get strength score
    setPasswordStrength(strength);  // Update state with the strength score
  };

  return (
    <>
      <Layout topbar={false}>
        {/* LOGIN AREA START (Register) */}
        <div className="ltn__login-area pb-110 pt-20">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center">
                  <h1 className="section-title">{registerData.title}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box pt-10">
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

                    <input
                      type="password"
                      name="password"
                      placeholder={registerData.passwordPlaceholder}
                      value={password}
                      onChange={handlePasswordChange}  // Use the password handler
                      required
                    />
                    {/* Display password strength only when user starts typing */}
                    {password && (
                      <p><small>Password Strength: {registerData.passwordStrengthLabels[passwordStrength]}</small></p>
                    )}
                    <input
                      type="password"
                      name="confirmpassword"
                      placeholder={registerData.confirmPasswordPlaceholder}
                      value={confirm_password}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="btn-wrapper text-center mt-0">
                      <label className="checkbox-inline mb-10">
                        {registerData.privacyPolicyConsentText}
                      </label>
                      <button className="theme-btn-1 btn reverse-color btn-block" type="submit">
                        {registerData.createAccountButton}
                      </button>
                    </div>
                  {errorMessage && <p>{errorMessage}</p>}
                  </form>
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
        {/* LOGIN AREA END */}

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
    </>
  );
}

export default Register;
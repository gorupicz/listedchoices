import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ErrorSuccessModal from "@/components/modals/ErrorSuccessModal";
import { signIn, getSession, useSession } from "next-auth/react";
import React, { useCallback } from "react";
import Webcam from "react-webcam";
import { FaTrash } from "react-icons/fa";

export async function getServerSideProps(context) {
  const { locale } = context;
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale

  const session = await getSession(context);

  if (session.user.idPhotograph) {
     console.log('Session foobar:', session);

    return {
      redirect: {
        destination: '/accreditation',
        permanent: false,
      },
    };
  }
  return {
    props: { user: session.user },
  };
}

function IdVerification({ user }) {
  const { t } = useTranslation('register/id-verification'); 
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [photo, setPhoto] = useState(null);
  const webcamRef = React.useRef(null);
  const { update } = useSession(); // Get the update function from useSession

  // Modal functions to show and close modal
  const handleShowModal = (message, isError = false) => {
    setModalMessage(message);
    setIsError(isError);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setPhoto(null); // Reset the photo to retake
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      handleShowModal(t('photoRequiredMessage'), true);
      return;
    }

    // Convert base64 to Blob
    const byteString = atob(photo.split(',')[1]);
    const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');
    formData.append('userId', user.id);

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.idVerificationInProgress) {
        // Call the custom API route to refresh the session
        await fetch('/api/refresh-session');
        // Refresh the session to update the state
        await update(); // Use the update function to refresh the session
        console.log('Session after update:', await getSession()); // Log the session to verify
        // Redirect to /accreditation after successful upload
        router.push('/accreditation');
        handleShowModal(t('successMessage'), false);
      } else {
        console.error('Error:', result.error);
        handleShowModal(t('errorMessage'), true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      handleShowModal(t('errorMessage'), true);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 820,
    facingMode: "user",
  };

  return (
    <>
      <Layout topbar={false}>
        <div className="ltn__login-area pb-65 pt-20">
          <div className="container">
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center mb-10">
                  <h1 className="section-title mb-10">{t('pageTitle')}</h1>
                  <p>{t('pageDescription')}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box">
                  <form onSubmit={handleSubmit}>
                    <div className="webcam-container">
                      {photo ? (
                        <img src={photo} alt="Captured" width="100%" className="mb-10"/>
                      ) : (
                        <Webcam
                          audio={false}
                          mirrored={true}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          width="100%"
                        />
                      )}
                      <button
                        type="button"
                        onClick={photo ? handleRetake : capture}
                        className="camera-btn"
                      >
                        {photo ? <FaTrash /> : ''}
                      </button>
                    </div>
                    <div className="btn-wrapper mt-10 text-center">
                      <button className="email-btn social-btn btn" type="submit">
                        {t('submitButtonText')}
                      </button>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>

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

export default IdVerification;
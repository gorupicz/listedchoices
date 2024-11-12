import Link from "next/link";
import { useTranslation } from 'react-i18next';

function CallToAction() {
  const { t } = useTranslation('components/callToAction');

  return (
    <>
      <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative">
        <div className="coll-to-info text-color-white">
          <h1>{t('heading')}</h1>
          <p>
            {t('paragraph')} <span>{t('spanText')}</span>
          </p>
        </div>
        <div className="btn-wrapper">
          <Link className="btn btn-effect-3 btn-white" href="/">
            {t('buttonText')} <i className="icon-next"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CallToAction;

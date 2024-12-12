import Link from "next/link";
import { useTranslation } from 'react-i18next';

const MobileMenuIcon = ({ eventKey, onClickHandler, closeSideBar }) => {
  const { t } = useTranslation('header/elements/menuIcon');
  const tabs = t('tabs', { returnObjects: true });
  const tab = tabs.find(tab => tab.eventKey === eventKey);

  if (!tab) return null;

  return (
    <li>
      <Link onClick={closeSideBar} href={tab.slideId ? `${tab?.link || '/'}?slideId=${tab.slideId}` : (tab?.link || '#')} target={tab?.target || '_self'}>{tab?.label || ''}</Link>
      {tab.subtabs && tab.subtabs.length > 0 && (
        <>
          <span
            className="menu-expand"
            onClick={onClickHandler}
            aria-hidden="true"
          ></span>
          <ul className="sub-menu">
            {tab.subtabs.map((subtab) => (
              <li key={subtab.eventKey}>
                <Link onClick={closeSideBar} href={subtab.slideId ? `${subtab?.link || '/'}?slideId=${subtab.slideId}` : (subtab?.link || '#')} target={subtab?.target || '_self'}>{subtab?.label || ''}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export default MobileMenuIcon; 
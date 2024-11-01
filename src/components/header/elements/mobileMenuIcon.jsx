import Link from "next/link";
import menuIcon from '@/data/header/elements/menuIcon/index.json';

const MobileMenuIcon = ({ eventKey, onClickHandler }) => {
  const tab = menuIcon.tabs.find(tab => tab.eventKey === eventKey);

  if (!tab) return null;

  return (
    <li>
      <Link href={tab.link}>{tab.label}</Link>
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
                <Link href={subtab.link}>{subtab.label}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export default MobileMenuIcon; 
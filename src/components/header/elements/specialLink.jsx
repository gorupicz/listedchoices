import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const SpecialLink = ({ addListing }) => {
  const { t } = useTranslation('header/elements/specialLink');

  if (!addListing) return null;

  const tab = t('tabs', { returnObjects: true })[0]; // Assuming you want the first tab

  return (
    <li className="special-link">
      <Link href={tab.link} target={tab.target} title={tab.title}>
        <span className="icon-text">
          {tab.icon ? React.createElement(iconMap[tab.icon]) : null}
        </span>
        {tab.label}
      </Link>
    </li>
  );
};

export default SpecialLink;

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const MobileMegaMenu = ({ eventKey, onClickHandler }) => {
    const { t } = useTranslation('header/elements/megaMenu');
    const tabs = t('tabs', { returnObjects: true });
    const tab = tabs.find(tab => tab.eventKey === eventKey);

    if (!tab) {
        return null;
    }

    return (
        <li>
            <Link href={tab.link}>{tab.label}</Link>
            <span
                className="menu-expand"
                onClick={onClickHandler}
                aria-hidden="true"
            ></span>
            <ul className="sub-menu">
                {tab.subtabs.map(subtab => (
                    <li key={subtab.eventKey}>
                        <Link href={subtab.link}>{subtab.label}</Link>
                        <span
                            className="menu-expand"
                            onClick={onClickHandler}
                            aria-hidden="true"
                        ></span>
                        <ul className="sub-menu">
                            {subtab.sub_subtabs.map(subSubtab => (
                                <li key={subSubtab.eventKey}>
                                    <Link href={subSubtab.link}>{subSubtab.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default MobileMegaMenu; 
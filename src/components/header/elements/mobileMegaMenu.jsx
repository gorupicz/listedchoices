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
            <Link href={tab.link} target={tab.target}>{tab.label}</Link>
            <span
                className="menu-expand"
                onClick={onClickHandler}
                aria-hidden="true"
            ></span>
            <ul className="sub-menu">
                {tab.subtabs.map(subtab => (
                    <li key={subtab.eventKey}>
                        <Link href={subtab.link} target={subtab.target}>{subtab.label}</Link>
                        <span
                            className="menu-expand"
                            onClick={onClickHandler}
                            aria-hidden="true"
                        ></span>
                        <ul className="sub-menu">
                            {subtab.sub_subtabs.map(subSubtab => (
                                <li key={subSubtab.eventKey}>
                                    <Link href={subSubtab.link} target={subSubtab.target}>{subSubtab.label}</Link>
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
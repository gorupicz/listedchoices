import React from 'react';
import Link from 'next/link';
import megaMenuData from '@/data/header/elements/megaMenu/index.json';

const MobileMegaMenu = ({ eventKey, onClickHandler }) => {
    const tab = megaMenuData.tabs.find(tab => tab.eventKey === eventKey);

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
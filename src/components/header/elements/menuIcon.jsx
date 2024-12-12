import React from 'react';
import Link from 'next/link';
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Map icon names to React components
const iconMap = {
    FaHome: FaHome,
    FaUserAlt: FaUserAlt,
    FaMapMarkerAlt: FaMapMarkerAlt,
    FaList: FaList,
    FaHeart: FaHeart,
    FaMapMarked: FaMapMarked,
    FaDollarSign: FaDollarSign,
    FaLock: FaLock,
    FaFacebookF: FaFacebookF,
    FaWhatsapp: FaWhatsapp,
    FaYoutube: FaYoutube,
    FaInstagram: FaInstagram,
    FaLinkedin: FaLinkedin,
};

const MenuIcon = ({ value }) => {
    const { t } = useTranslation('header/elements/menuIcon');
    const tabs = t('tabs', { returnObjects: true });
    const tab = tabs.find(tab => tab.eventKey === value);

    if (!tab) {
        return null;
    }
    return (
        <li className="menu-icon">
            <Link href={tab.slideId ? `${tab?.link || '/'}?slideId=${tab.slideId}` : (tab?.link || '#')} target={tab?.target || '_self'} title={tab?.title || ''}>
                <span className="icon-text">
                    {tab.icon ? React.createElement(iconMap[tab.icon]) : null}
                </span>
                {tab.label}
            </Link>
            {tab.subtabs && (
                <ul>
                    {tab.subtabs.map(subtab => (
                        <li key={subtab.eventKey}>
                            <Link href={subtab.slideId ? `${subtab?.link || '/'}?slideId=${subtab.slideId}` : (subtab?.link || '#')} target={subtab?.target || '_self'} title={subtab?.title || ''}>
                                <span className="icon-text">
                                    {subtab.icon ? React.createElement(iconMap[subtab.icon]) : null}
                                </span>
                                {subtab.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default MenuIcon; 
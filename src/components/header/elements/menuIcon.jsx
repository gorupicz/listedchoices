import React from 'react';
import Link from 'next/link';
import menuListData from '@/data/header/elements/menuIcon/index.json';
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
    const tab = menuListData.tabs.find(tab => tab.eventKey === value);

    if (!tab) {
        return null;
    }

    return (
        <li className="menu-icon">
            <Link href={tab.link} target={tab.target} title={tab.title}>
                <span className="icon-text">
                    {tab.icon ? React.createElement(iconMap[tab.icon]) : null}
                </span>
                {tab.label}
            </Link>
            {tab.subtabs && (
                <ul>
                    {tab.subtabs.map(subtab => (
                        <li key={subtab.eventKey}>
                            <Link href={subtab.link} target={subtab.target} title={subtab.title}>
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
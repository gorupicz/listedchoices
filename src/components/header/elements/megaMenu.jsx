import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

const MegaMenu = ({ value }) => {
    const { t } = useTranslation('header/elements/megaMenu');
    const tabs = t('tabs', { returnObjects: true });
    const tab = tabs.find(tab => tab.eventKey === value);

    const [hoveredImgSrc, setHoveredImgSrc] = useState(tab.imgSrc);

    const handleMouseEnter = (imgSrc) => {
        if (imgSrc) {
            setHoveredImgSrc(imgSrc);
        }
    };

    const handleMouseLeave = () => {
        setHoveredImgSrc(tab.imgSrc);
    };

    if (!tab) {
        return null;
    }

    return (
        <li className="menu-icon mega-menu-parent">
            <Link href={tab.link} target={tab.target} title={tab.title}>
                <span className="icon-text">
                    {tab.icon ? React.createElement(iconMap[tab.icon]) : null}
                </span>
                {tab.label}
            </Link>
            <ul className="mega-menu column-4">
                {tab.subtabs.map(subtab => (
                    <li key={subtab.eventKey}>
                        <Link href={subtab.link} target={subtab.target} title={subtab.title}
                            onMouseEnter={() => handleMouseEnter(subtab.imgSrc)}
                            onMouseLeave={handleMouseLeave}>
                            <span className="icon-text">
                                {subtab.icon ? React.createElement(iconMap[subtab.icon]) : null}
                            </span>
                            {subtab.label}
                        </Link>
                        {subtab.sub_subtabs && (
                            <ul>
                                {subtab.sub_subtabs.map(subSubtab => (
                                    <li key={subSubtab.eventKey}>
                                        <Link href={subSubtab.link} target={subSubtab.target} title={subSubtab.title}
                                            onMouseEnter={() => handleMouseEnter(subSubtab.imgSrc)}
                                            onMouseLeave={handleMouseLeave}>
                                            <span className="icon-text">
                                                {subSubtab.icon ? React.createElement(iconMap[subSubtab.icon]) : null}
                                            </span>
                                            {subSubtab.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
                <li>
                    <Image
                        src={hoveredImgSrc.startsWith('http') ? hoveredImgSrc : `${process.env.NEXT_PUBLIC_BASE_URL}${hoveredImgSrc}`}
                        alt={tab.imgAlt}
                        layout="responsive"
                        width={500}
                        height={300}
                    />
                </li>
            </ul>
        </li>
    );
};

export default MegaMenu;
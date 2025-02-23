import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import MenuIcon from '@/components/header/elements/menuIcon';
import MegaMenu from '@/components/header/elements/megaMenu';
import SpecialLink from '@/components/header/elements/specialLink';



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

const MenuList = ({ addListing }) => {
  
  return (
    <ul>
      <MenuIcon value="4" />
      <MenuIcon value="1" />
      <MegaMenu value="1" />
      <MenuIcon value="2" />
      <SpecialLink addListing={addListing} />
    </ul>
  );
};

export default MenuList;

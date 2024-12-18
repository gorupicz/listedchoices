import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { parsePhoneNumber } from 'libphonenumber-js';
import { createAvatar } from '@dicebear/avatars';
import * as personasStyle from '@dicebear/personas';
import { productSlug } from "@/lib/product";

const TechnicianCard = ({ item, showVotes = true }) => {
  const imageUrl = item.thumbImage || `data:image/svg+xml;utf8,${encodeURIComponent(createAvatar(personasStyle, { seed: item.name || 'default' }))}`;
  const slug = productSlug(item.name);

  let formattedPhoneNumber = 'Invalid number';
  try {
    const phoneNumber = parsePhoneNumber(`+${item.phoneNumber}`);
    if (phoneNumber.isValid()) {
      formattedPhoneNumber = phoneNumber.formatInternational();
    }
  } catch (error) {
    console.error("Failed to parse phone number:", error.message);
  }

  return (
    <div className="ltn__gallery-item-inner">
      <div
        className="ltn__gallery-item-img"
        onClick={() => window.open(`https://wa.me/${item.phoneNumber}`, '_blank')}
        style={{ cursor: "pointer" }}
      >
        <Image 
          src={imageUrl}
          alt="Image"
          layout="responsive"
          width={500}
          height={500}
        />
        <span className="ltn__gallery-action-icon">
          <span>
            <FaWhatsapp />
          </span>
          <p>Click to send a WhatsApp<br /><b>{formattedPhoneNumber}</b></p>
        </span>
      </div>
      <div className="ltn__gallery-item-info">
        <h4>
          <Link href={`${slug}`}>{item.name}</Link>
        </h4>
        <p>{item.specialities.join(', ')}</p>
      </div>
      {showVotes && (
        <div className="ltn__gallery-item-vote">
          <div className="common vote-down">
            <FaThumbsDown />
            <span>{item.downvotes === 0 ? "" : item.downvotes}</span>
          </div>
          <div className="common vote-up">
            <FaThumbsUp />
            <span>{item.upvotes === 0 ? "" : item.upvotes}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianCard; 
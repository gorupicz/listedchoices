import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { parsePhoneNumber } from 'libphonenumber-js';
import { createAvatar } from '@dicebear/avatars';
import * as personasStyle from '@dicebear/personas';
import { productSlug } from "@/lib/product";
import { useState } from 'react';

const TechnicianCard = ({ item, showVotes = true }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteAnimation, setVoteAnimation] = useState('');
  const [upvotes, setUpvotes] = useState(item.upvotes);
  const [downvotes, setDownvotes] = useState(item.downvotes);

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

  const handleVote = async (id, type) => {
    if (hasVoted) return; // Prevent multiple votes

    try {
      const response = await fetch('/api/technicians/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      setHasVoted(true);
      setVoteAnimation(type); // Set animation type based on vote

      // Update the vote count in the frontend
      if (type === 'up') {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          <div
            className={`common vote-down ${voteAnimation === 'down' ? 'animate-vote' : ''}`}
            onClick={() => handleVote(item.id, 'down')}
            style={{ pointerEvents: hasVoted ? 'none' : 'auto' }}
          >
            <FaThumbsDown className={voteAnimation === 'down' ? 'animate-icon' : ''} />
            <span className={voteAnimation === 'down' ? 'animate-icon' : ''}>
              {downvotes === 0 ? "" : downvotes}
            </span>
          </div>
          <div
            className={`common vote-up ${voteAnimation === 'up' ? 'animate-vote' : ''}`}
            onClick={() => handleVote(item.id, 'up')}
            style={{ pointerEvents: hasVoted ? 'none' : 'auto' }}
          >
            <FaThumbsUp className={voteAnimation === 'up' ? 'animate-icon' : ''} />
            <span className={voteAnimation === 'up' ? 'animate-icon' : ''}>
              {upvotes === 0 ? "" : upvotes}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianCard; 
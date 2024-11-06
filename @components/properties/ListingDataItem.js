import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TooltipSpan from "@/components/Tooltips/TooltipSpan";
import { FaExclamationCircle } from 'react-icons/fa'; // Adjust the import path as necessary
import propertyData from 'src/data/properties/[slug].json'; // Adjust the path as necessary

function ListingDataItem({ label, value, tooltip, isCurrency = true, followRequestStatus, handleFollowButtonClick, buttonDisabled, isBlurable = true }) {
  const { data: session, status } = useSession();

  const formattedValue = isCurrency
    ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
    : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}%`;

  const renderContent = () => {
    if (session && status === "authenticated") {
      if (followRequestStatus === 'ACCEPTED') {
        return <span>{formattedValue}</span>;
      } else if (followRequestStatus === 'PENDING') {
        return isBlurable ? (
          <TooltipSpan id="obfuscation-tooltip" title={propertyData.pendingLoggedTooltip}>
            <span className="obfuscation-span">obfusca</span>
          </TooltipSpan>
        ) : (
          <span>{formattedValue}</span>
        );
      } else {
        return !buttonDisabled ? (
          <a onClick={handleFollowButtonClick}>
            {isBlurable ? (
              <TooltipSpan id="obfuscation-tooltip" title={propertyData.cacButton.loggedNotFollowing}>
                <span className="obfuscation-span">obfusca</span>
              </TooltipSpan>
            ) : (
              <span>{formattedValue}</span>
            )}
          </a>
        ) : (
          isBlurable ? (
            <TooltipSpan id="obfuscation-tooltip" title={propertyData.pendingLoggedTooltip}>
              <span className="obfuscation-span">obfusca</span>
            </TooltipSpan>
          ) : (
            <span>{formattedValue}</span>
          )
        );
      }
    } else {
      return (
        <Link href="/register">
          {isBlurable ? (
            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginNotLoggedTooltip}>
              <span className="obfuscation-span">obfusca</span>
            </TooltipSpan>
          ) : (
            <span>{formattedValue}</span>
          )}
        </Link>
      );
    }
  };

  return (
    <>
      {tooltip ? (
        <TooltipSpan title={tooltip} id={label.toLowerCase().replace(/\s+/g, '-')}>
          <label>{label}: <FaExclamationCircle /></label>
        </TooltipSpan>
      ) : (
        <label>{label}:</label>
      )}
      {renderContent()}
    </>
  );
}

export default ListingDataItem;
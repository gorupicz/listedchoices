import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TooltipSpan from "@/components/Tooltips/TooltipSpan";
import { FaExclamationCircle, FaLock, FaCircle } from 'react-icons/fa'; // Adjust the import path as necessary
import propertyData from 'src/data/properties/[slug].json'; // Adjust the path as necessary
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

function ListingDataItem({ label, value, tooltip, isCurrency = true, followRequestStatus, handleFollowButtonClick, buttonDisabled, isBlurable = true, isPreviousYearValue = false }) {
  const { data: session, status } = useSession();
  const { t } = useTranslation('properties/[slug]'); // Use the appropriate namespace for translations
  const [currentValue, previousYearValue] = isPreviousYearValue ? value : [value, null];
  console.log('currentValue:', currentValue);
  console.log('previousYearValue:', previousYearValue);
  
  const formattedValue = isCurrency
    ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(currentValue)}`
    : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(currentValue)}%`;

  const formattedPreviousYearValue = isPreviousYearValue && previousYearValue !== null
  ? (isCurrency
      ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(previousYearValue)}`
      : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(previousYearValue)}%`)
  : null;

  const yoyComparison = isPreviousYearValue && previousYearValue !== null
    ? ((currentValue - previousYearValue) / previousYearValue) * 100
    : null;

  const yoyComparisonSymbol = yoyComparison > 0 
    ? <a style={{ color: 'green' }}><FaCircle /></a> // Green circle
    : yoyComparison < 0 
    ? <a style={{ color: 'red' }}><FaCircle /></a> // Red triangle pointing down
    : null;
  
  const yoyComparisonFormatted = yoyComparison ? `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(yoyComparison)}%` : '';
  
  const renderContent = () => {
    if (session && status === "authenticated") {
      if (followRequestStatus === 'ACCEPTED') {
        return <span>
          {yoyComparisonSymbol && (
            <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
              {yoyComparisonSymbol}
            </TooltipSpan>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;{formattedValue}
        </span>;
      } else if (followRequestStatus === 'PENDING') {
        return isBlurable ? (
          <TooltipSpan id="obfuscation-tooltip" title={t('pendingLoggedTooltip')}>
            <span>
              {yoyComparisonSymbol && (
                <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                  {yoyComparisonSymbol}
                </TooltipSpan>
              )}
              <span className="obfuscation-container">
                <FaLock className="lock-icon" />
                <span className="obfuscation-span">obfusca</span>
              </span>
            </span>
          </TooltipSpan>
        ) : (
          <span>
            {yoyComparisonSymbol && (
              <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                {yoyComparisonSymbol}
              </TooltipSpan>
            )}
            {formattedValue}
          </span>
        );
      } else {
        return !buttonDisabled ? (
          <a onClick={handleFollowButtonClick}>
            {isBlurable ? (
              <TooltipSpan id="obfuscation-tooltip" title={t('cacButton.loggedNotFollowing')}>
                <span>
                  {yoyComparisonSymbol && (
                    <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                      {yoyComparisonSymbol}
                    </TooltipSpan>
                  )}
                  <span className="obfuscation-container">
                    <FaLock className="lock-icon" />
                    <span className="obfuscation-span">obfusca</span>
                  </span>
                </span>
              </TooltipSpan>
            ) : (
              <span>
                {yoyComparisonSymbol && (
                  <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                    {yoyComparisonSymbol}
                  </TooltipSpan>
                )}
                {formattedValue}
              </span>
            )}
          </a>
        ) : (
          isBlurable ? (
            <TooltipSpan id="obfuscation-tooltip" title={t('cacButton.loggedNotFollowing')}>
              <span>
                {yoyComparisonSymbol && (
                  <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                    {yoyComparisonSymbol}
                  </TooltipSpan>
                )}
                <span className="obfuscation-container">
                  <FaLock className="lock-icon" />
                  <span className="obfuscation-span">obfusca</span>
                </span>
              </span>
            </TooltipSpan>
          ) : (
            <span>
              {yoyComparisonSymbol && (
                <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                  {yoyComparisonSymbol}
                </TooltipSpan>
              )}
              {formattedValue}
            </span>
          )
        );
      }
    } else {
      return (
        <Link href="/register">
          {isBlurable ? (
            <span>
                {yoyComparisonSymbol && (
                  <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                    {yoyComparisonSymbol}
                  </TooltipSpan>
                )}
                <TooltipSpan id="obfuscation-tooltip" title={t('loginNotLoggedTooltip')}>
                    <span className="obfuscation-container">
                      <FaLock className="lock-icon" />
                      <span className="obfuscation-span">obfusca</span>
                    </span>
                </TooltipSpan>
            </span>
          ) : (
            <span>
                {yoyComparisonSymbol && (
                <TooltipSpan title={`${yoyComparisonFormatted} ${t('yoyComparisonTooltip')}`}>
                  {yoyComparisonSymbol}
                </TooltipSpan>
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formattedValue}
            </span>
          )}
        </Link>
      );
    }
  };

  return (
    <>
      {tooltip ? (
        <TooltipSpan title={tooltip} id={label.toLowerCase().replace(/\s+/g, '-')}>
          <label>
            {label.split(' ').slice(0, -1).join(' ')}{' '}
            <label style={{ whiteSpace: 'nowrap' }}>
              {label.split(' ').slice(-1)} <FaExclamationCircle />
            </label>
          </label>
        </TooltipSpan>
      ) : (
        <label>{label}:</label>
      )}
      {renderContent()}
    </>
  );
}

export default ListingDataItem;
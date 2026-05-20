import { useEffect, useState } from 'react';
import { useModal } from './context/useModal';
import { shouldWarnForExternalLink } from '../utils/externalLinks';

export type ExternalLinkState = {
  url: string;
  hostname: string;
  newTab: boolean;
};

export const useExternalLinkInterceptor = () => {
  const { openModal, closeModal } = useModal();
  const [externalLinkData, setExternalLinkData] = useState<ExternalLinkState | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // 1. Ignore modified clicks to preserve default browser behavior
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
        return;
      }

      // 2. Use event delegation to find the closest anchor tag
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;

      // 3. Check if we should warn
      if (shouldWarnForExternalLink(anchor)) {
        event.preventDefault();
        
        const url = anchor.href;
        let hostname = url;
        try {
          hostname = new URL(url).hostname;
        } catch (e) {
          // Fallback if parsing fails (though shouldWarnForExternalLink already checks this)
        }

        const newTab = anchor.target === '_blank';

        // 4. Update state and show modal
        setExternalLinkData({ url, hostname, newTab });
        openModal('externalLink');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [openModal]);

  const proceedToExternalLink = () => {
    if (!externalLinkData) return;
    
    // Use target="_blank" with noopener noreferrer for security if it was requested
    if (externalLinkData.newTab) {
      window.open(externalLinkData.url, '_blank', 'noopener,noreferrer');
    } else {
      // Even for same tab, using rel=noopener noreferrer on external is good practice
      // but window.location doesn't accept rel.
      window.location.href = externalLinkData.url;
    }
    
    closeModal('externalLink');
  };

  const cancelExternalLink = () => {
    closeModal('externalLink');
  };

  return {
    externalLinkData,
    proceedToExternalLink,
    cancelExternalLink
  };
};

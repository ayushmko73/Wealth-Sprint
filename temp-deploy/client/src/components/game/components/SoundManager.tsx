import React, { useEffect } from 'react';
import { useAudio } from '../../../lib/stores/useAudio';

const SoundManager: React.FC = () => {
  const { backgroundMusic, hitSound, successSound } = useAudio();

  useEffect(() => {
    // Add click sound to all buttons
    const addClickSounds = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (!button.dataset.soundAdded) {
          button.addEventListener('click', () => {
            if (hitSound && !hitSound.paused) {
              hitSound.currentTime = 0;
            }
            hitSound?.play().catch(() => {}); // Ignore errors for better UX
          });
          button.dataset.soundAdded = 'true';
        }
      });
    };

    // Add sounds when component mounts
    addClickSounds();

    // Add sounds to dynamically created elements
    const observer = new MutationObserver(() => {
      addClickSounds();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [hitSound]);

  return null; // This component doesn't render anything
};

export default SoundManager;
import React, { useEffect } from 'react';
import { useAudio } from '../../../lib/stores/useAudio';

const SoundManager: React.FC = () => {
  const { initializeAudio, playHit, hitSound } = useAudio();

  useEffect(() => {
    // Initialize audio files when component mounts
    initializeAudio();
  }, [initializeAudio]);

  useEffect(() => {
    // Add click sound to all buttons
    const addClickSounds = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (!button.dataset.soundAdded) {
          button.addEventListener('click', () => {
            playHit();
          });
          button.dataset.soundAdded = 'true';
        }
      });
    };

    // Add sounds when component mounts and hitSound is available
    if (hitSound) {
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
    }
  }, [hitSound, playHit]);

  return null; // This component doesn't render anything
};

export default SoundManager;
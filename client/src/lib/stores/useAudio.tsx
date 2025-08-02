import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  volume: number;
  isBackgroundPlaying: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playHit: () => void;
  playSuccess: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Start unmuted by default - audio ON
  volume: 100,
  isBackgroundPlaying: true, // Background music starts playing by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  initializeAudio: () => {
    try {
      // Initialize background music
      const bgMusic = new Audio('/sounds/background.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
      
      // Initialize hit sound
      const hit = new Audio('/sounds/hit.mp3');
      hit.volume = 0.4;
      
      // Initialize success sound
      const success = new Audio('/sounds/success.mp3');
      success.volume = 0.5;
      
      set({ 
        backgroundMusic: bgMusic,
        hitSound: hit,
        successSound: success
      });
      
      console.log("Audio files initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic, isBackgroundPlaying } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Handle background music based on mute state
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else if (isBackgroundPlaying) {
        backgroundMusic.play().catch(console.error);
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  setVolume: (volume) => {
    const { backgroundMusic, hitSound, successSound } = get();
    const normalizedVolume = volume / 100;
    
    set({ volume });
    
    if (backgroundMusic) backgroundMusic.volume = normalizedVolume * 0.3;
    if (hitSound) hitSound.volume = normalizedVolume * 0.4;
    if (successSound) successSound.volume = normalizedVolume * 0.5;
  },
  
  playBackgroundMusic: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(console.error);
      set({ isBackgroundPlaying: true });
    }
  },
  
  stopBackgroundMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      set({ isBackgroundPlaying: false });
    }
  },
  
  playHit: () => {
    const { hitSound, isMuted, volume } = get();
    if (hitSound && !isMuted) {
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = (volume / 100) * 0.4;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted, volume } = get();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.volume = (volume / 100) * 0.5;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  }
}));

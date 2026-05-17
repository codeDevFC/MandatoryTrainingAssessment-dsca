import confetti from 'canvas-confetti';

// Play clap sound
export const playClapSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const playClap = () => {
    const now = audioContext.currentTime;
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    
    // Create clap sound using white noise
    const bufferSize = 4096;
    const noise = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = buffer;
    noise.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
    
    noise.start();
    noise.stop(now + 0.3);
  };
  
  // Play 3 claps
  playClap();
  setTimeout(playClap, 200);
  setTimeout(playClap, 400);
};

// Fire confetti
export const fireConfetti = () => {
  // Multiple confetti bursts
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  setTimeout(() => {
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6, x: 0.2 }, startVelocity: 25 });
  }, 150);
  setTimeout(() => {
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6, x: 0.8 }, startVelocity: 25 });
  }, 300);
  setTimeout(() => {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
  }, 500);
};

// Full celebration
export const celebrate = () => {
  fireConfetti();
  playClapSound();
};

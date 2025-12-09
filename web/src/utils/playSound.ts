const playSound = (url: string, volume: number = 1) => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch((err) => {
    console.error("Failed to play sound:", err);
  });
};

export default playSound;



// playSound('./sound/click.mp3', 0.5)
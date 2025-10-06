class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private initialized = false;

  init() {
    if (this.initialized) return;

    // Preload sound effects
    this.loadSound('hover', '/sounds/hover.mp3');
    this.loadSound('click_forward', '/sounds/click_forward_menu.mp3');
    this.loadSound('click_backward', '/sounds/click_backward_menu.mp3');

    this.initialized = true;
  }

  private loadSound(key: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = 0.5;
    this.sounds.set(key, audio);
  }

  play(key: string) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.currentTime = 0;
      // Apply 3x volume multiplier to make SFX louder
      const boostedVolume = Math.min(1, sound.volume * 3);
      const originalVolume = sound.volume;
      sound.volume = boostedVolume;
      sound.play().catch(err => console.log(`Sound play failed for ${key}:`, err));
      // Reset volume after playing
      setTimeout(() => { sound.volume = originalVolume; }, 100);
    }
  }

  setVolume(key: string, volume: number) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const soundManager = new SoundManager();

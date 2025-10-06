class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private initialized = false;
  private currentVolume = 0.5;

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
    audio.volume = this.currentVolume;
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

  private clampVolume(value: number) {
    return Math.max(0, Math.min(1, value));
  }

  setVolume(volume: number): void;
  setVolume(key: string, volume: number): void;
  setVolume(arg1: string | number, arg2?: number): void {
    if (typeof arg1 === 'string') {
      if (typeof arg2 !== 'number') return;
      const sound = this.sounds.get(arg1);
      if (sound) {
        sound.volume = this.clampVolume(arg2);
      }
      return;
    }

    const volume = this.clampVolume(arg1);
    this.currentVolume = volume;
    this.sounds.forEach((sound) => {
      sound.volume = volume;
    });
  }
}

export const soundManager = new SoundManager();


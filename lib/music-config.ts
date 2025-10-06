// Music configuration - add your tracks here
export const musicConfig = {
  menu: [
    { name: 'Aerial City', filename: '1 Tetr.io OST - Aerial City.mp3' },
    { name: 'To the Limit', filename: '2 Tetr.io OST - To the Limit.mp3' },
    { name: 'Wind Trail', filename: '3 Tetr.io OST - Wind Trail.mp3' },
  ],
  game: [
    { name: 'Ice Eyes', filename: '20 Tetr.io OST - Ice Eyes.mp3' },
    { name: 'Burning Spirit, Awakening Soul', filename: '28 Tetr.io OST - Burning Spirit, Awakening Soul.mp3' },
    { name: 'Super Machine Soul', filename: '31 Tetr.io OST - Super Machine Soul.mp3' },
    { name: 'Universe 5239', filename: '32 Tetr.io OST - Universe 5239.mp3' },
    { name: 'Hyper Velocity', filename: '34 Tetr.io OST - Hyper Velocity.mp3' },
  ],
};

type MusicType = 'menu' | 'game';

// Fade volume helper function
const fadeVolume = (audio: HTMLAudioElement, startVol: number, endVol: number, duration: number): Promise<void> => {
  return new Promise((resolve) => {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = (endVol - startVol) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newVolume = startVol + (volumeStep * currentStep);
      audio.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        clearInterval(interval);
        resolve();
      }
    }, stepDuration);
  });
};

class GlobalMusicManager {
  private audio: HTMLAudioElement | null = null;
  private currentType: MusicType | null = null;
  private currentTrackIndex: number = 0;
  private volume: number = 0.05;
  private isMuted: boolean = false;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  init(type: MusicType, trackIndex: number, volume: number, isMuted: boolean) {
    this.currentType = type;
    this.currentTrackIndex = trackIndex;
    this.volume = volume;
    this.isMuted = isMuted;

    if (!this.audio) {
      const tracks = musicConfig[type];
      this.audio = new Audio(`/music/${type}/${tracks[trackIndex].filename}`);
      this.audio.loop = false;
      this.audio.volume = isMuted ? 0 : volume;

      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      // Auto-play on first user interaction
      const playMusic = () => {
        if (this.audio) {
          this.audio.play().catch(err => console.log('Audio play failed:', err));
        }
        document.removeEventListener('click', playMusic);
      };
      document.addEventListener('click', playMusic);
    }
  }

  switchType(newType: MusicType, trackIndex: number) {
    if (!this.audio || newType === this.currentType) return;

    const oldAudio = this.audio;
    this.currentType = newType;
    this.currentTrackIndex = trackIndex;

    const tracks = musicConfig[newType];
    const newAudio = new Audio(`/music/${newType}/${tracks[trackIndex].filename}`);
    newAudio.loop = false;
    newAudio.volume = 0;

    newAudio.addEventListener('ended', () => {
      this.nextTrack();
    });

    fadeVolume(oldAudio, oldAudio.volume, 0, 500).then(() => {
      oldAudio.pause();
      this.audio = newAudio;
      newAudio.play().catch(err => console.log('Music switch failed:', err));
      fadeVolume(newAudio, 0, this.isMuted ? 0 : this.volume, 500);
    });
  }

  changeTrack(trackIndex: number) {
    if (!this.audio || !this.currentType) return;

    this.currentTrackIndex = trackIndex;
    const tracks = musicConfig[this.currentType];
    this.audio.src = `/music/${this.currentType}/${tracks[trackIndex].filename}`;
    this.audio.currentTime = 0;
    this.audio.play().catch(err => console.log('Track change failed:', err));
    this.notifyListeners();
  }

  nextTrack() {
    if (!this.currentType) return;
    const tracks = musicConfig[this.currentType];
    this.changeTrack((this.currentTrackIndex + 1) % tracks.length);
  }

  setVolume(volume: number, isMuted: boolean) {
    this.volume = volume;
    this.isMuted = isMuted;
    if (this.audio) {
      this.audio.volume = isMuted ? 0 : volume;
    }
  }

  getCurrentTrack() {
    return this.currentTrackIndex;
  }

  getCurrentType() {
    return this.currentType;
  }

  getAudio() {
    return this.audio;
  }
}

export const globalMusicManager = new GlobalMusicManager();


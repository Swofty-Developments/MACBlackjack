# Music and Sound Effects Setup

## 📁 Directory Structure

### Music Folders
- **`public/music/menu/`** - Menu/Lobby background music
- **`public/music/game/`** - In-game background music

**How to add music:**
1. Place your music files in the appropriate folder with any filename you want
2. Edit `lib/music-config.ts` to add your tracks:

```typescript
export const musicConfig = {
  menu: [
    { name: 'Chill Vibes', filename: 'chill-vibes.mp3' },
    { name: 'Lobby Theme', filename: 'lobby-theme.mp3' },
    // Add your tracks here
  ],
  game: [
    { name: 'Epic Gameplay', filename: 'epic-gameplay.mp3' },
    // Add your tracks here
  ],
};
```

- `name` - Display name shown in the music player
- `filename` - Actual filename of your music file

**Note:** You can add unlimited tracks! Just add entries to the config file.

### Sound Effects Folder
- **`public/sounds/`** - UI sound effects

Required sound files:
- `hover.mp3` - Plays when hovering over buttons/menu items
- `click_forward_menu.mp3` - Plays when entering a menu or moving forward
- `click_backward_menu.mp3` - Plays when going back to the menu

### Font Folder
- **`public/fonts/`** - HUN-din 1451 font files (TETR.IO font)

Required font files:
- `HUN-din-1451.ttf` (TrueType format)
- `HUN-din-1451.woff2` (Web format - recommended)
- `HUN-din-1451.woff` (Web format - fallback)

## 🎵 Music Player Features

### Dial Control
- **Drag the dial** - Rotate with mouse to change tracks
- **Scroll on dial** - Use mouse wheel to switch tracks
- **Volume slider** - Adjust from 0-100%
- **Mute button** - Quick mute/unmute

### Automatic Features
- **Fade transitions** - Smooth fade out/in when switching between menu and game music
- **Track switching** - Seamlessly switch between all configured tracks
- **Auto-play** - Music starts on first user interaction
- **Custom naming** - Use any filename and display name you want

## 🎮 Sound Effects

### Hover Sound
- Plays on all button hovers
- Plays on menu tile hovers
- Plays on clickable element hovers

### Navigation Sounds
- **Forward click** - When entering a menu, starting game, or signing out
- **Backward click** - When returning to main menu

## 🔤 Font Setup

Place your HUN font files in `public/fonts/`:
1. Download HUN font (TTF or WOFF2 format)
2. Name them `HUN.ttf` and/or `HUN.woff2`
3. Font will automatically apply globally across the website

## 📥 Where to Get Assets

### Music
- [Pixabay Music](https://pixabay.com/music/) - Free music
- [Incompetech](https://incompetech.com/) - Royalty-free music
- [Free Music Archive](https://freemusicarchive.org/) - Creative Commons music

### Sound Effects
- [Freesound](https://freesound.org/) - Free sound effects
- [Zapsplat](https://www.zapsplat.com/) - UI sound effects
- [Mixkit](https://mixkit.co/free-sound-effects/) - Free SFX

### Font
- Download HUN font from your preferred font source
- Ensure you have proper licensing for web use

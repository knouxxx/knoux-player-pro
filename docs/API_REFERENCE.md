# API Reference - KNOUX Player X™

## 📋 Table of Contents
1. [Media Engine API](#media-engine-api)
2. [UI Components API](#ui-components-api)
3. [Plugin API](#plugin-api)
4. [IPC API](#ipc-api)
5. [State Management API](#state-management-api)
6. [Native Bridges API](#native-bridges-api)

## 🎮 Media Engine API

### MediaEngine Class
The core playback engine supporting multiple backends.

#### Constructor
```typescript
new MediaEngine(options?: EngineOptions)
```

#### Properties
| Property | Type | Description |
|----------|------|-------------|
| `currentEngine` | `PlaybackEngine` | Active playback engine |
| `version` | `string` | Engine version |
| `isLoaded` | `boolean` | Whether media is loaded |

#### Methods

##### `load(src: string, options?: PlaybackOptions): Promise<void>`
Load media file or stream.

**Parameters:**
- `src`: Media URL or file path
- `options`: Playback configuration

**Example:**
```typescript
await mediaEngine.load('video.mp4', {
  startTime: 0,
  volume: 0.8,
  autoplay: true
});
```

##### `play(): Promise<void>`
Start or resume playback.

##### `pause(): Promise<void>`
Pause playback.

##### `seek(time: number): Promise<void>`
Seek to specific time in seconds.

##### `setVolume(volume: number): void`
Set volume (0.0 to 1.0).

##### `setPlaybackRate(rate: number): void`
Set playback speed (0.5 to 4.0).

##### `getStats(): PlaybackStats`
Get current playback statistics.

##### `destroy(): void`
Clean up resources.

#### Events
MediaEngine extends EventEmitter and emits:

| Event | Data | Description |
|-------|------|-------------|
| `loading` | `{ src: string }` | Started loading media |
| `loaded` | `{ src: string, engine: PlaybackEngine }` | Media loaded successfully |
| `play` | none | Playback started |
| `pause` | none | Playback paused |
| `timeupdate` | `{ currentTime: number, duration: number }` | Playback time updated |
| `ended` | none | Playback completed |
| `error` | `{ error: string }` | Error occurred |
| `volumechange` | `{ volume: number }` | Volume changed |
| `ratechange` | `{ rate: number }` | Playback rate changed |
| `seek` | `{ time: number }` | Seeking completed |

### PlaybackEngine Enum
```typescript
enum PlaybackEngine {
  AUTO = 'auto',           // Auto-select best engine
  HTML5 = 'html5',         // Native HTML5 video
  FFMPEG_NATIVE = 'ffmpeg_native', // FFmpeg with native acceleration
  HARDWARE = 'hardware',   // Direct hardware decoding
  STREAMING = 'streaming'  // Adaptive streaming
}
```

### PlaybackOptions Interface
```typescript
interface PlaybackOptions {
  startTime?: number;      // Start time in seconds
  volume?: number;         // Initial volume (0-1)
  playbackRate?: number;   // Playback speed (0.5-4)
  autoplay?: boolean;      // Auto-play when ready
  muted?: boolean;         // Start muted
  loop?: boolean;          // Loop playback
  audioTrack?: number;     // Audio track index
  subtitleTrack?: number;  // Subtitle track index
  videoTrack?: number;     // Video track index
  preload?: 'none' | 'metadata' | 'auto'; // Preload strategy
}
```

### PlaybackStats Interface
```typescript
interface PlaybackStats {
  fps: number;             // Current frames per second
  droppedFrames: number;   // Dropped frames count
  bufferLevel: number;     // Buffer fill percentage (0-100)
  networkSpeed: number;    // Download speed in kbps
  cpuUsage: number;        // CPU usage percentage (0-100)
  memoryUsage: number;     // Memory usage in MB
}
```

## 🎨 UI Components API

### Neon Components
All Neon components support these common props:

#### Common Props
| Prop | Type | Default | Description |
|------|------|---------|
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` | Inline styles |
| `disabled` | `boolean` | `false` | Disabled state |
| `onClick` | `(event: React.MouseEvent) => void` | - | Click handler |
| `variant` | `'primary' | 'secondary' | 'danger' | 'success'` | `'primary'` | Visual variant |

### NeonButton
Interactive button with neon glow effects.

```tsx
import { NeonButton } from '../ui/components/neon';

<NeonButton
  variant="primary"
  size="medium"
  onClick={() => console.log('Clicked')}
  disabled={false}
  loading={false}
  fullWidth={false}
>
  Click Me
</NeonButton>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|
| `size` | `'small' | 'medium' | 'large'` | `'medium'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `fullWidth` | `boolean` | `false` | Full width button |
| `icon` | `React.ReactNode` | - | Icon component |

### NeonPanel
Glass-morphism panel container.

```tsx
import { NeonPanel } from '../ui/components/neon';

<NeonPanel
  variant="elevated"
  blurStrength={10}
  borderGlow={true}
  padding="medium"
>
  <h2>Panel Title</h2>
  <p>Panel content here...</p>
</NeonPanel>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|
| `variant` | `'flat' | 'elevated' | 'floating'` | `'elevated'` | Panel style |
| `blurStrength` | `number` | `8` | Background blur strength |
| `borderGlow` | `boolean` | `true` | Enable border glow |
| `padding` | `'none' | 'small' | 'medium' | 'large'` | `'medium'` | Inner padding |

### NeonSlider
Interactive slider with neon track.

```tsx
import { NeonSlider } from '../ui/components/neon';

<NeonSlider
  min={0}
  max={100}
  value={volume}
  onChange={(value) => setVolume(value)}
  step={1}
  showValue={true}
  vertical={false}
/>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `value` | `number` | - | Current value |
| `onChange` | `(value: number) => void` | - | Value change handler |
| `step` | `number` | `1` | Step increment |
| `showValue` | `boolean` | `false` | Show current value |
| `vertical` | `boolean` | `false` | Vertical orientation |

### NeonPlayerControls
Pre-built player control bar.

```tsx
import { NeonPlayerControls } from '../ui/components/neon';

<NeonPlayerControls
  isPlaying={isPlaying}
  currentTime={120}
  duration={360}
  volume={0.8}
  onPlayPause={() => togglePlayback()}
  onSeek={(time) => seekTo(time)}
  onVolumeChange={(vol) => setVolume(vol)}
  showTime={true}
  compact={false}
/>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|
| `isPlaying` | `boolean` | `false` | Whether media is playing |
| `currentTime` | `number` | `0` | Current playback time |
| `duration` | `number` | `0` | Media duration |
| `volume` | `number` | `1` | Current volume |
| `onPlayPause` | `() => void` | - | Play/pause toggle |
| `onSeek` | `(time: number) => void` | - | Seek handler |
| `onVolumeChange` | `(volume: number) => void` | - | Volume change handler |
| `showTime` | `boolean` | `true` | Show time display |
| `compact` | `boolean` | `false` | Compact mode |

## 🔌 Plugin API

### KnouxPlugin Base Class
All plugins must extend this class.

```typescript
abstract class KnouxPlugin {
  // Properties
  readonly manifest: PluginManifest;
  readonly api: PluginAPI;

  // Lifecycle methods
  abstract onLoad(): Promise<void>;
  abstract onUnload(): Promise<void>;

  // Registration methods
  registerComponent(name: string, component: React.ComponentType): void;
  registerCommand(name: string, handler: CommandHandler): void;
  registerMiddleware(type: MiddlewareType, handler: MiddlewareHandler): void;

  // Event hooks
  onMediaPlay(handler: () => void): void;
  onMediaPause(handler: () => void): void;
  onMediaSeek(handler: (time: number) => void): void;

  // Utility methods
  showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error'): void;
  openDialog(title: string, content: React.ReactNode, options?: DialogOptions): Promise<void>;
  getSetting<T>(key: string, defaultValue?: T): Promise<T>;
  setSetting<T>(key: string, value: T): Promise<void>;
}
```

### PluginManifest Interface
```typescript
interface PluginManifest {
  id: string;                    // Unique plugin ID (com.domain.plugin)
  name: string;                  // Plugin display name
  version: string;              // Semantic version (1.0.0)
  author: string;               // Author name
  description: string;          // Short description
  entry: string;                // Entry point file
  permissions: PluginPermission[]; // Required permissions
  dependencies?: string[];      // Other plugin dependencies
  minAppVersion?: string;       // Minimum app version required
  icons?: {                     // Plugin icons
    [size: string]: string;
  };
}
```

### PluginPermission Type
```typescript
type PluginPermission =
  | 'media'       // Access media playback
  | 'ui'          // Modify UI
  | 'settings'    // Read/write settings
  | 'storage'     // Persistent storage
  | 'network'     // Network requests
  | 'filesystem'  // File system access
  | 'notifications' // Show notifications
  | 'clipboard';   // Clipboard access
```

### PluginAPI Interface
```typescript
interface PluginAPI {
  // Media control
  media: {
    play(): Promise<void>;
    pause(): Promise<void>;
    seek(time: number): Promise<void>;
    getCurrentTime(): Promise<number>;
    getDuration(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    getVolume(): Promise<number>;
  };

  // UI manipulation
  ui: {
    showToast(message: string, options?: ToastOptions): void;
    openModal(component: React.ComponentType, props?: any): string;
    closeModal(id: string): void;
    updateStatusBar(text: string, type?: 'info' | 'warning' | 'error'): void;
  };

  // Settings
  settings: {
    get<T>(key: string, defaultValue?: T): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    getAll(): Promise<Record<string, any>>;
    watch<T>(key: string, callback: (value: T) => void): () => void;
  };

  // Storage
  storage: {
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
  };

  // Network
  network: {
    fetch(url: string, options?: RequestInit): Promise<Response>;
    download(url: string, dest: string): Promise<void>;
    upload(file: File, url: string): Promise<void>;
  };
}
```

### Example Plugin
```typescript
import { KnouxPlugin, PluginManifest } from '@knoux/plugin-sdk';

const manifest: PluginManifest = {
  id: 'com.example.youtube-dl',
  name: 'YouTube Downloader',
  version: '1.0.0',
  author: 'Example Corp',
  description: 'Download videos from YouTube',
  entry: './index.js',
  permissions: ['network', 'storage', 'notifications']
};

class YouTubePlugin extends KnouxPlugin {
  async onLoad() {
    // Register UI component
    this.registerComponent('youtube-downloader', YouTubeDownloader);

    // Add menu item
    this.api.ui.addMenuItem({
      id: 'youtube-download',
      label: 'Download from YouTube',
      onClick: () => this.showDownloadDialog()
    });

    // Listen to media events
    this.onMediaPlay(() => {
      console.log('Media started playing');
    });
  }

  async onUnload() {
    console.log('YouTube plugin unloaded');
  }

  private async showDownloadDialog() {
    // Implementation
  }
}

export default YouTubePlugin;
```

## 🔄 IPC API

### Main Process → Renderer
Communication from main process to renderer.

```typescript
// In main process
import { ipcMain } from 'electron';

// Send to renderer
mainWindow.webContents.send('media:loaded', {
  duration: 3600,
  title: 'Video Title'
});

// Handle from renderer
ipcMain.handle('media:play', async () => {
  // Play media
  return { success: true };
});
```

### Renderer → Main Process
Communication from renderer to main process.

```typescript
// In renderer process
import { ipcRenderer } from 'electron';

// Preload script exposes safe methods
window.knouxAPI = {
  media: {
    play: () => ipcRenderer.invoke('media:play'),
    pause: () => ipcRenderer.invoke('media:pause'),
    seek: (time: number) => ipcRenderer.invoke('media:seek', time)
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value)
  }
};

// Usage in React component
const playMedia = async () => {
  const result = await window.knouxAPI.media.play();
  if (result.success) {
    console.log('Playing');
  }
};
```

### Available IPC Channels

#### Media Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `media:load` | Renderer → Main | Load media file |
| `media:play` | Renderer → Main | Start playback |
| `media:pause` | Renderer → Main | Pause playback |
| `media:seek` | Renderer → Main | Seek to time |
| `media:volume` | Renderer → Main | Set volume |
| `media:loaded` | Main → Renderer | Media loaded event |
| `media:timeupdate` | Main → Renderer | Time update event |

#### File Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `file:open` | Renderer → Main | Open file dialog |
| `file:save` | Renderer → Main | Save file dialog |
| `file:list` | Renderer → Main | List directory |
| `file:read` | Renderer → Main | Read file content |
| `file:write` | Renderer → Main | Write to file |

#### Settings Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `settings:get` | Renderer → Main | Get setting value |
| `settings:set` | Renderer → Main | Set setting value |
| `settings:getAll` | Renderer → Main | Get all settings |
| `settings:reset` | Renderer → Main | Reset to defaults |

#### System Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `system:info` | Renderer → Main | Get system info |
| `system:platform` | Renderer → Main | Get platform |
| `system:version` | Renderer → Main | Get app version |
| `system:restart` | Renderer → Main | Restart app |
| `system:quit` | Renderer → Main | Quit app |

## 🗄️ State Management API

### Redux Store Structure
```typescript
interface RootState {
  app: AppState;           // Application state
  playback: PlaybackState; // Playback state
  playlist: PlaylistState; // Playlist state
  settings: SettingsState; // Settings state
  theme: ThemeState;       // Theme state
  localization: LocalizationState; // Localization state
  network: NetworkState;   // Network state
  update: UpdateState;     // Update state
}
```

### AppState
```typescript
interface AppState {
  currentView: 'player' | 'library' | 'settings' | 'browser';
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  warnings: string[];
  lastAction: string;
  actionHistory: ActionHistoryItem[];
}
```

### PlaybackState
```typescript
interface PlaybackState {
  status: PlayerStatus;    // IDLE, BUFFERING, PLAYING, PAUSED, STOPPED, ERROR
  currentTime: number;     // Current playback time in seconds
  duration: number;        // Total duration in seconds
  volume: number;          // Volume level (0-1)
  playbackRate: number;    // Playback speed (0.5-4)
  isMuted: boolean;        // Muted state
  buffering: boolean;      // Whether buffering
  warnings: string[];      // Playback warnings
  errors: string[];        // Playback errors
  currentTrack: ITrack | null; // Current track
  audioTracks: AudioTrack[];   // Available audio tracks
  subtitleTracks: SubtitleTrack[]; // Available subtitle tracks
}
```

### PlaylistState
```typescript
interface PlaylistState {
  tracks: ITrack[];        // All tracks in playlist
  currentIndex: number;    // Index of current track
  queue: string[];         // Track IDs in queue
  shuffle: boolean;        // Shuffle enabled
  repeat: 'none' | 'one' | 'all'; // Repeat mode
  history: string[];       // Play history
  favorites: string[];     // Favorite track IDs
}
```

### SettingsState
```typescript
interface SettingsState {
  // Appearance
  theme: 'neon-purple' | 'neon-cyan' | 'dark' | 'light';
  language: 'en' | 'ar';
  fontSize: 'small' | 'medium' | 'large';

  // Playback
  autoplay: boolean;
  loop: boolean;
  hardwareAcceleration: boolean;

  // Audio
  audioDevice: string;
  volumeBoost: boolean;
  normalizeAudio: boolean;

  // Video
  aspectRatio: 'auto' | '16:9' | '4:3' | '21:9';
  deinterlace: boolean;
  upscaleQuality: 'low' | 'medium' | 'high';

  // Subtitles
  subtitleLanguage: string;
  subtitleSize: number;
  subtitleFont: string;

  // Network
  cacheSize: number;
  bufferSize: number;
  proxy: ProxySettings | null;
}
```

### Available Actions

#### Playback Actions
```typescript
// Action creators
const play = createAction('playback/play');
const pause = createAction('playback/pause');
const seek = createAction<number>('playback/seek');
const setVolume = createAction<number>('playback/setVolume');

// Usage
dispatch(play());
dispatch(seek(120));
dispatch(setVolume(0.8));
```

#### Playlist Actions
```typescript
const addTrack = createAction<ITrack>('playlist/addTrack');
const removeTrack = createAction<string>('playlist/removeTrack');
const setShuffle = createAction<boolean>('playlist/setShuffle');
const nextTrack = createAction('playlist/nextTrack');
const previousTrack = createAction('playlist/previousTrack');
```

#### Settings Actions
```typescript
const setTheme = createAction<string>('settings/setTheme');
const setLanguage = createAction<string>('settings/setLanguage');
const setHardwareAcceleration = createAction<boolean>('settings/setHardwareAcceleration');
const resetSettings = createAction('settings/reset');
```

### Selectors

#### Playback Selectors
```typescript
export const selectPlayback = (state: RootState) => state.playback;
export const selectIsPlaying = (state: RootState) =>
  state.playback.status === PlayerStatus.PLAYING;
export const selectCurrentTime = (state: RootState) => state.playback.currentTime;
export const selectDuration = (state: RootState) => state.playback.duration;
export const selectVolume = (state: RootState) => state.playback.volume;
export const selectBuffering = (state: RootState) => state.playback.buffering;
```

#### Playlist Selectors
```typescript
export const selectPlaylist = (state: RootState) => state.playlist;
export const selectCurrentTrack = (state: RootState) =>
  state.playlist.tracks[state.playlist.currentIndex];
export const selectPlaylistLength = (state: RootState) =>
  state.playlist.tracks.length;
export const selectShuffle = (state: RootState) => state.playlist.shuffle;
export const selectRepeat = (state: RootState) => state.playlist.repeat;
```

#### Settings Selectors
```typescript
export const selectSettings = (state: RootState) => state.settings;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectHardwareAcceleration = (state: RootState) =>
  state.settings.hardwareAcceleration;
```

## 🔧 Native Bridges API

### FFmpegBridge
Bridge to FFmpeg for media processing.

```typescript
const ffmpeg = new FFmpegBridge();
await ffmpeg.initialize();

// Transcode video
const transcodedUrl = await ffmpeg.transcode('input.mkv', 'mp4', {
  videoCodec: 'h264',
  audioCodec: 'aac',
  videoBitrate: '2000k'
});

// Get media info
const info = await ffmpeg.getMediaInfo('video.mp4');
console.log(`Duration: ${info.format.duration}s`);

// Extract subtitles
const subtitles = await ffmpeg.extractSubtitles('movie.mkv', 'srt');

// Take screenshot
const screenshot = await ffmpeg.takeScreenshot('video.mp4', 60, 'png');
```

### HardwareAccelerator
Hardware acceleration management.

```typescript
const hw = new HardwareAccelerator();
await hw.initialize();

// Check capabilities
if (hw.isAvailable()) {
  const gpuInfo = hw.getGPUInfo();
  console.log(`GPU: ${gpuInfo?.vendor} ${gpuInfo?.renderer}`);

  const supportedCodecs = hw.getSupportedCodecs();
  console.log('Supported codecs:', supportedCodecs);

  // Hardware decode
  const frame = await hw.decodeVideoWithHardware(videoData, 'h264');
}
```

### AudioProcessor
Advanced audio processing.

```typescript
const audio = new AudioProcessor();
await audio.initialize();

// Load and play audio
await audio.loadFromURL('audio.mp3');
audio.play();

// Apply EQ
audio.setEQPreset('rock');
audio.setEQBand(0, 6); // Boost bass

// Enable effects
audio.enableNormalization(-23);
audio.enableSpatialAudio(true);

// Get visualization data
const audioData = audio.getAudioData();
renderVisualization(audioData.frequencies);
```

### Available Native Modules

| Module | Description | Platform Support |
|--------|-------------|------------------|
| `FFmpegBridge` | Media transcoding & analysis | All |
| `HardwareAccelerator` | GPU acceleration | Windows/macOS/Linux |
| `AudioProcessor` | Audio effects & EQ | All |
| `VideoRenderer` | Hardware video rendering | All with WebGL |
| `CodecDetector` | Codec detection | All |
| `StreamAnalyzer` | Stream analysis | All |

---

**Note:** This API reference covers the core functionality. For detailed implementation examples, see the source code and example plugins.

## 🔗 Related Links
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)
- [Examples](../examples/)

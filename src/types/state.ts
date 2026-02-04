import { PlayerStatus, ITrack, IPlaybackState as MediaPlaybackState } from './media';

export interface IAppState {
  currentView: 'player' | 'library' | 'settings' | 'browser';
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IPlaybackState extends MediaPlaybackState {
  currentTrack: ITrack | null;
  audioTracks: Array<{ id: number; language: string; title: string }>;
  subtitleTracks: Array<{ id: number; language: string; title: string }>;
}

export interface IPlaylistState {
  tracks: ITrack[];
  currentIndex: number;
  queue: string[];
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface ISettingsState {
  themeMode: 'light' | 'dark' | 'system';
  audioDevice: string;
  hardwareAccel: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  autoplay: boolean;
  loop: boolean;
  volume: number;
  playbackRate: number;
  subtitleEnabled: boolean;
  subtitleLanguage: string;
  subtitleSize: number;
  cacheSize: number;
  bufferSize: number;
  proxy: any;
  aspectRatio: string;
  deinterlace: boolean;
  upscaleQuality: 'low' | 'medium' | 'high';
  volumeBoost: boolean;
  normalizeAudio: boolean;
}

export interface IThemeState {
  name: 'neon-purple' | 'neon-cyan';
  glassmorphism: boolean;
  neonEffects: boolean;
}

export interface ILocalizationState {
  locale: 'en' | 'ar';
  strings: Record<string, string>;
}

export interface INetworkState {
  isConnected: boolean;
  connectionType: 'offline' | 'wifi' | 'ethernet' | 'unknown';
  lastChecked: number | null;
}

export interface IUpdateState {
  available: boolean;
  version: string | null;
  lastChecked: number | null;
  releaseNotes?: string;
}

export interface IRootState {
  app: IAppState;
  playback: IPlaybackState;
  playlist: IPlaylistState;
  settings: ISettingsState;
  theme: IThemeState;
  localization: ILocalizationState;
  network: INetworkState;
  update: IUpdateState;
}

export { PlayerStatus };

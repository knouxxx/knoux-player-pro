export enum PlayerStatus {
  IDLE = "IDLE",
  BUFFERING = "BUFFERING",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
  ERROR = "ERROR"
}

export interface IMediaMetadata {
  duration?: number;
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string;
  trackNumber?: number;
  totalTracks?: number;
}

export interface ITrack {
  id: string;
  uuid: string;
  path: string;
  filename: string;
  extension: string;
  sizeBytes: number;
  metadata: IMediaMetadata;
  lastPlayed?: number;
  subtitle?: {
    src: string;
    label: string;
    language: string;
  };
}

export interface IPlaybackState {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  buffering: boolean;
  warnings: string[];
  errors: string[];
}

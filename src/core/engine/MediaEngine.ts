import { EventEmitter } from 'events';
import { FFmpegBridge } from '../../native/ffmpeg/FFmpegBridge';
import { PlayerStatus } from '../../types/media';

export class MediaEngine extends EventEmitter {
  private videoElement: HTMLVideoElement | null = null;
  private currentEngine: PlaybackEngine = PlaybackEngine.AUTO;
  private stats: PlaybackStats = {
    fps: 0,
    droppedFrames: 0,
    bufferLevel: 0,
    networkSpeed: 0,
    cpuUsage: 0,
    memoryUsage: 0,
  };

  constructor() {
    super();
    this.setMaxListeners(20);
  }

  async load(src: string, options: PlaybackOptions = {}): Promise<void> {
    try {
      this.emit('loading', { src });

      const engineType = await this.detectBestEngine(src);
      this.currentEngine = engineType;

      switch (engineType) {
        case PlaybackEngine.FFMPEG_NATIVE:
          await this.loadWithFFmpeg(src, options);
          break;
        case PlaybackEngine.HARDWARE:
          await this.loadWithHardwareAccel(src, options);
          break;
        default:
          await this.loadWithHTML5(src, options);
      }

      this.emit('loaded', { src, engine: engineType });
    } catch (error) {
      this.emit('error', { error: (error as Error).message });
      throw error;
    }
  }

  async play(): Promise<void> {
    if (this.videoElement) {
      await this.videoElement.play();
      this.emit('play');
    }
  }

  async pause(): Promise<void> {
    if (this.videoElement) {
      this.videoElement.pause();
      this.emit('pause');
    }
  }

  async seek(time: number): Promise<void> {
    if (this.videoElement) {
      this.videoElement.currentTime = time;
      this.emit('seek', { time });
    }
  }

  setVolume(volume: number): void {
    if (this.videoElement) {
      this.videoElement.volume = Math.max(0, Math.min(1, volume));
      this.emit('volumechange', { volume });
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.videoElement) {
      this.videoElement.playbackRate = rate;
      this.emit('ratechange', { rate });
    }
  }

  getStats(): PlaybackStats {
    return { ...this.stats };
  }

  destroy(): void {
    if (this.videoElement) {
      this.videoElement.src = '';
      this.videoElement.load();
      this.videoElement = null;
    }
    this.removeAllListeners();
  }

  private async detectBestEngine(src: string): Promise<PlaybackEngine> {
    const extension = src.split('.').pop()?.toLowerCase() || '';

    const hasHardwareAccel = await this.checkHardwareAcceleration();

    const needsFFmpeg = [
      'mkv',
      'avi',
      'flv',
      'mov',
      'wmv',
      'hevc',
      'h265',
      'vp9',
      'av1',
    ].some((ext) => src.includes(ext));

    if (needsFFmpeg && hasHardwareAccel) {
      return PlaybackEngine.HARDWARE;
    }

    if (needsFFmpeg) {
      return PlaybackEngine.FFMPEG_NATIVE;
    }

    if (extension.length === 0 && !src.includes('.')) {
      return PlaybackEngine.STREAMING;
    }

    return PlaybackEngine.HTML5;
  }

  private async loadWithFFmpeg(src: string, options: PlaybackOptions): Promise<void> {
    const ffmpeg = new FFmpegBridge();
    await ffmpeg.initialize();

    const outputFormat = 'mp4';
    const transcodedUrl = await ffmpeg.transcode(src, outputFormat, options);

    this.videoElement = document.createElement('video');
    this.videoElement.src = transcodedUrl;
    this.setupVideoElement();
  }

  private async loadWithHardwareAccel(src: string, options: PlaybackOptions): Promise<void> {
    if ('VideoDecoder' in window) {
      const videoDecoder = new (window as any).VideoDecoder({
        output: (frame: any) => {
          this.renderFrame(frame);
        },
        error: (error: Error) => {
          this.emit('error', { error: error.message });
        },
      });

      const config = {
        codec: 'avc1.640028',
        hardwareAcceleration: 'prefer-hardware',
        optimizeForLatency: true,
      };

      videoDecoder.configure(config);
    } else {
      await this.loadWithFFmpeg(src, options);
    }
  }

  private async loadWithHTML5(src: string, options: PlaybackOptions): Promise<void> {
    this.videoElement = document.createElement('video');
    this.videoElement.src = src;
    this.setupVideoElement(options);
  }

  private setupVideoElement(options: PlaybackOptions = {}): void {
    if (!this.videoElement) return;

    this.videoElement.crossOrigin = 'anonymous';
    this.videoElement.preload = 'auto';
    this.videoElement.playsInline = true;

    if (options.muted !== undefined) {
      this.videoElement.muted = options.muted;
    }

    if (options.loop !== undefined) {
      this.videoElement.loop = options.loop;
    }

    if (options.volume !== undefined) {
      this.videoElement.volume = Math.max(0, Math.min(1, options.volume));
    }

    if (options.playbackRate !== undefined) {
      this.videoElement.playbackRate = options.playbackRate;
    }

    if (options.startTime !== undefined) {
      this.videoElement.currentTime = options.startTime;
    }

    this.videoElement.addEventListener('timeupdate', () => {
      if (!this.videoElement) return;
      this.emit('timeupdate', {
        currentTime: this.videoElement.currentTime,
        duration: this.videoElement.duration,
      });
    });

    this.videoElement.addEventListener('ended', () => {
      this.emit('ended');
    });

    this.videoElement.addEventListener('error', () => {
      this.emit('error', {
        error: this.videoElement?.error?.message || 'Unknown error',
      });
    });

    this.videoElement.addEventListener('playing', () => {
      this.emit('statuschange', { status: PlayerStatus.PLAYING });
    });

    this.videoElement.addEventListener('pause', () => {
      this.emit('statuschange', { status: PlayerStatus.PAUSED });
    });
  }

  private renderFrame(frame: any): void {
    void frame;
  }

  private async checkHardwareAcceleration(): Promise<boolean> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

      if (!gl) return false;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return (
          renderer.toLowerCase().includes('nvidia') ||
          renderer.toLowerCase().includes('amd') ||
          renderer.toLowerCase().includes('intel') ||
          renderer.toLowerCase().includes('apple')
        );
      }

      return false;
    } catch {
      return false;
    }
  }
}

export enum PlaybackEngine {
  AUTO = 'auto',
  HTML5 = 'html5',
  FFMPEG_NATIVE = 'ffmpeg_native',
  HARDWARE = 'hardware',
  STREAMING = 'streaming',
}

export interface PlaybackOptions {
  startTime?: number;
  volume?: number;
  playbackRate?: number;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  audioTrack?: number;
  subtitleTrack?: number;
  videoTrack?: number;
}

export interface PlaybackStats {
  fps: number;
  droppedFrames: number;
  bufferLevel: number;
  networkSpeed: number;
  cpuUsage: number;
  memoryUsage: number;
}

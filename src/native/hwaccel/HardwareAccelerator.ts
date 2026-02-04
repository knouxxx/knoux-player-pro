export class HardwareAccelerator {
  private gpuInfo: GPUInfo | null = null;
  private accelerationEnabled = false;

  async initialize(): Promise<void> {
    try {
      this.gpuInfo = await this.detectGPU();
      this.accelerationEnabled = await this.enableAcceleration();

      console.log('Hardware acceleration initialized:', {
        gpu: this.gpuInfo,
        enabled: this.accelerationEnabled,
      });
    } catch (error) {
      console.warn('Hardware acceleration failed to initialize:', error);
      this.accelerationEnabled = false;
    }
  }

  async detectGPU(): Promise<GPUInfo> {
    const info: GPUInfo = {
      vendor: 'unknown',
      renderer: 'unknown',
      type: 'unknown',
      memory: 0,
      supportsWebGL2: false,
      supportsWebGPU: false,
      supportsVideoDecoder: false,
      supportsVideoEncoder: false,
    };

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        info.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        info.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }

      info.supportsWebGL2 = !!canvas.getContext('webgl2');

      const videoElement = document.createElement('video');
      const canPlayTypes = [
        'video/mp4; codecs="avc1.640028"',
        'video/webm; codecs="vp9"',
        'video/mp4; codecs="hevc"',
      ];

      info.supportsVideoDecoder = canPlayTypes.some(
        (type) => videoElement.canPlayType(type) === 'probably',
      );
    }

    if ('gpu' in navigator) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (adapter) {
          info.supportsWebGPU = true;
          info.vendor = adapter.info.vendor || info.vendor;
          info.renderer = adapter.info.architecture || info.renderer;
        }
      } catch {
        info.supportsWebGPU = false;
      }
    }

    info.type = this.detectGPUType(info.renderer);

    return info;
  }

  async enableAcceleration(): Promise<boolean> {
    const gpu = await this.detectGPU();

    if (gpu.type === 'integrated' && !gpu.supportsVideoDecoder) {
      return false;
    }

    const platform = this.getPlatform();

    switch (platform) {
      case 'windows':
        return this.enableWindowsAcceleration(gpu);
      case 'macos':
        return this.enableMacOSAcceleration(gpu);
      case 'linux':
        return this.enableLinuxAcceleration(gpu);
      default:
        return gpu.supportsVideoDecoder;
    }
  }

  async decodeVideoWithHardware(data: ArrayBuffer, codec: string): Promise<VideoFrame> {
    if (!this.accelerationEnabled || !('VideoDecoder' in window)) {
      throw new Error('Hardware acceleration not available');
    }

    const decoder = new (window as any).VideoDecoder({
      output: (frame: VideoFrame) => frame,
      error: (error: Error) => {
        throw new Error(`Hardware decoding failed: ${error.message}`);
      },
    });

    const config = {
      codec: this.mapCodecToHardware(codec),
      hardwareAcceleration: 'prefer-hardware',
      optimizeForLatency: true,
    };

    decoder.configure(config);

    const chunk = new (window as any).EncodedVideoChunk({
      type: 'key',
      timestamp: 0,
      duration: 0,
      data: data,
    });

    decoder.decode(chunk);

    await decoder.flush();
    decoder.close();

    return null as any;
  }

  async encodeVideoWithHardware(
    frames: ImageBitmap[],
    options: EncodeOptions,
  ): Promise<ArrayBuffer> {
    if (!this.accelerationEnabled || !('VideoEncoder' in window)) {
      throw new Error('Hardware encoding not available');
    }

    const chunks: ArrayBuffer[] = [];
    const encoder = new (window as any).VideoEncoder({
      output: (chunk: any) => {
        chunks.push(chunk.data);
      },
      error: (error: Error) => {
        throw new Error(`Hardware encoding failed: ${error.message}`);
      },
    });

    const config = {
      codec: this.mapCodecToHardware(options.codec),
      hardwareAcceleration: 'prefer-hardware',
      width: options.width,
      height: options.height,
      bitrate: options.bitrate,
      framerate: options.framerate,
    };

    encoder.configure(config);

    for (let i = 0; i < frames.length; i += 1) {
      const frame = new (window as any).VideoFrame(frames[i], {
        timestamp: i * (1000 / options.framerate),
        duration: 1000 / options.framerate,
      });

      encoder.encode(frame);
      frame.close();
    }

    await encoder.flush();
    encoder.close();

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    return result.buffer;
  }

  getSupportedCodecs(): string[] {
    const codecs: string[] = [];

    if (!this.gpuInfo) return codecs;

    if (this.gpuInfo.supportsVideoDecoder) {
      codecs.push('h264', 'h265', 'vp9', 'av1', 'vp8', 'mpeg4', 'hevc');
    }

    return codecs;
  }

  isAvailable(): boolean {
    return this.accelerationEnabled;
  }

  getGPUInfo(): GPUInfo | null {
    return this.gpuInfo;
  }

  private detectGPUType(renderer: string): GPUType {
    const rendererLower = renderer.toLowerCase();

    if (rendererLower.includes('nvidia')) return 'discrete';
    if (rendererLower.includes('amd')) return 'discrete';
    if (rendererLower.includes('radeon')) return 'discrete';
    if (rendererLower.includes('intel')) return 'integrated';
    if (rendererLower.includes('apple')) return 'apple';
    if (rendererLower.includes('mali')) return 'mobile';
    if (rendererLower.includes('adreno')) return 'mobile';

    return 'unknown';
  }

  private getPlatform(): Platform {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('linux')) return 'linux';

    return 'unknown';
  }

  private mapCodecToHardware(codec: string): string {
    const codecMap: Record<string, string> = {
      h264: 'avc1.640028',
      h265: 'hev1.1.6.L93.B0',
      hevc: 'hev1.1.6.L93.B0',
      vp9: 'vp09.00.10.08',
      av1: 'av01.0.04M.08',
    };

    return codecMap[codec.toLowerCase()] || codec;
  }

  private async enableWindowsAcceleration(gpu: GPUInfo): Promise<boolean> {
    if (gpu.vendor.includes('nvidia')) {
      return true;
    }

    if (gpu.vendor.includes('intel')) {
      return gpu.renderer.includes('HD Graphics') || gpu.renderer.includes('Iris');
    }

    return gpu.supportsVideoDecoder;
  }

  private async enableMacOSAcceleration(gpu: GPUInfo): Promise<boolean> {
    return gpu.type === 'apple' || gpu.supportsVideoDecoder;
  }

  private async enableLinuxAcceleration(gpu: GPUInfo): Promise<boolean> {
    if (gpu.vendor.includes('intel')) {
      return true;
    }

    if (gpu.vendor.includes('amd')) {
      return gpu.renderer.includes('Radeon') || gpu.renderer.includes('AMD');
    }

    return false;
  }
}

export interface GPUInfo {
  vendor: string;
  renderer: string;
  type: GPUType;
  memory: number;
  supportsWebGL2: boolean;
  supportsWebGPU: boolean;
  supportsVideoDecoder: boolean;
  supportsVideoEncoder: boolean;
}

export interface EncodeOptions {
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
  quality?: number;
}

export type GPUType = 'discrete' | 'integrated' | 'apple' | 'mobile' | 'unknown';
export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

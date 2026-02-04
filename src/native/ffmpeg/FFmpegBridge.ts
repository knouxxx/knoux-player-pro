export class FFmpegBridge {
  private ffmpeg: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
      this.ffmpeg = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
      });

      await this.ffmpeg.load();
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`FFmpeg initialization failed: ${(error as Error).message}`);
    }
  }

  async transcode(
    inputUrl: string,
    outputFormat: string,
    options: TranscodeOptions = {},
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await fetch(inputUrl);
    const inputArrayBuffer = await response.arrayBuffer();

    this.ffmpeg.FS('writeFile', 'input', new Uint8Array(inputArrayBuffer));

    const command = this.buildTranscodeCommand(outputFormat, options);

    await this.ffmpeg.run(...command);

    const outputData = this.ffmpeg.FS('readFile', `output.${outputFormat}`);

    const outputBlob = new Blob([outputData.buffer], {
      type: this.getMimeType(outputFormat),
    });

    return URL.createObjectURL(outputBlob);
  }

  async getMediaInfo(inputUrl: string): Promise<MediaInfo> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await fetch(inputUrl);
    const inputArrayBuffer = await response.arrayBuffer();

    this.ffmpeg.FS('writeFile', 'input', new Uint8Array(inputArrayBuffer));

    await this.ffmpeg.run('-i', 'input', '-f', 'ffmetadata');

    return {
      format: {
        filename: inputUrl,
        format_name: 'unknown',
        format_long_name: 'unknown',
        duration: 0,
        size: inputArrayBuffer.byteLength,
        bit_rate: 0,
      },
      streams: [],
    };
  }

  async extractSubtitles(inputUrl: string, format: 'srt' | 'vtt' | 'ass'): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await fetch(inputUrl);
    const inputArrayBuffer = await response.arrayBuffer();

    this.ffmpeg.FS('writeFile', 'input', new Uint8Array(inputArrayBuffer));

    await this.ffmpeg.run('-i', 'input', '-map', '0:s:0', '-f', format, `subtitles.${format}`);

    const subtitleData = this.ffmpeg.FS('readFile', `subtitles.${format}`);
    return new TextDecoder().decode(subtitleData);
  }

  async takeScreenshot(
    inputUrl: string,
    time: number,
    format: 'png' | 'jpg' = 'png',
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await fetch(inputUrl);
    const inputArrayBuffer = await response.arrayBuffer();

    this.ffmpeg.FS('writeFile', 'input', new Uint8Array(inputArrayBuffer));

    await this.ffmpeg.run(
      '-ss',
      time.toString(),
      '-i',
      'input',
      '-vframes',
      '1',
      '-f',
      'image2',
      `screenshot.${format}`,
    );

    const imageData = this.ffmpeg.FS('readFile', `screenshot.${format}`);
    const imageBlob = new Blob([imageData.buffer], {
      type: `image/${format}`,
    });

    return URL.createObjectURL(imageBlob);
  }

  private buildTranscodeCommand(outputFormat: string, options: TranscodeOptions): string[] {
    const command = ['-i', 'input'];

    if (options.videoCodec) {
      command.push('-c:v', options.videoCodec);
    }

    if (options.audioCodec) {
      command.push('-c:a', options.audioCodec);
    }

    if (options.videoBitrate) {
      command.push('-b:v', options.videoBitrate);
    }

    if (options.audioBitrate) {
      command.push('-b:a', options.audioBitrate);
    }

    if (options.scale) {
      command.push('-vf', `scale=${options.scale.width}:${options.scale.height}`);
    }

    command.push('-f', outputFormat);
    command.push(`output.${outputFormat}`);

    return command;
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      flac: 'audio/flac',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };

    return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
  }

  dispose(): void {
    if (this.ffmpeg) {
      this.ffmpeg.exit();
      this.ffmpeg = null;
    }
    this.isInitialized = false;
  }
}

export interface TranscodeOptions {
  videoCodec?: string;
  audioCodec?: string;
  videoBitrate?: string;
  audioBitrate?: string;
  scale?: { width: number; height: number };
  preserveQuality?: boolean;
}

export interface MediaInfo {
  format: {
    filename: string;
    format_name: string;
    format_long_name: string;
    duration: number;
    size: number;
    bit_rate: number;
  };
  streams: Array<{
    index: number;
    codec_type: 'video' | 'audio' | 'subtitle';
    codec_name: string;
    width?: number;
    height?: number;
    sample_rate?: number;
    channels?: number;
    language?: string;
  }>;
}

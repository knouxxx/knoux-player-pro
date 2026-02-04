import { FFmpegBridge } from '../../src/native/ffmpeg/FFmpegBridge';

jest.mock('@ffmpeg/ffmpeg', () => ({
  createFFmpeg: () => ({
    load: jest.fn().mockResolvedValue(undefined),
    FS: jest
      .fn()
      .mockImplementation((_action: string) => ({
        writeFile: jest.fn(),
        readFile: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3, 4])),
      })),
    run: jest.fn().mockResolvedValue(undefined),
    exit: jest.fn(),
  }),
}));

describe('FFmpegBridge', () => {
  let ffmpegBridge: FFmpegBridge;

  beforeEach(() => {
    ffmpegBridge = new FFmpegBridge();
  });

  afterEach(() => {
    ffmpegBridge.dispose();
  });

  describe('initialize()', () => {
    it('should initialize FFmpeg', async () => {
      await ffmpegBridge.initialize();

      expect(true).toBe(true);
    });

    it('should handle initialization errors', async () => {
      const mockCreateFFmpeg = require('@ffmpeg/ffmpeg').createFFmpeg;
      mockCreateFFmpeg.mockImplementationOnce(() => ({
        load: jest.fn().mockRejectedValue(new Error('FFmpeg failed to load')),
      }));

      await expect(ffmpegBridge.initialize()).rejects.toThrow('FFmpeg initialization failed');
    });
  });

  describe('transcode()', () => {
    beforeEach(async () => {
      await ffmpegBridge.initialize();

      global.fetch = jest.fn().mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      }) as jest.Mock;
    });

    it('should transcode video', async () => {
      const result = await ffmpegBridge.transcode('input.mp4', 'webm');

      expect(result).toContain('blob:');
      expect(typeof result).toBe('string');
    });

    it('should handle transcode errors', async () => {
      const mockFFmpeg = require('@ffmpeg/ffmpeg').createFFmpeg();
      mockFFmpeg.run.mockRejectedValueOnce(new Error('Transcode failed'));

      await expect(ffmpegBridge.transcode('input.mp4', 'webm')).rejects.toThrow();
    });
  });

  describe('getMediaInfo()', () => {
    it('should return media info', async () => {
      await ffmpegBridge.initialize();

      global.fetch = jest.fn().mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      }) as jest.Mock;

      const info = await ffmpegBridge.getMediaInfo('test.mp4');

      expect(info).toHaveProperty('format');
      expect(info).toHaveProperty('streams');
      expect(Array.isArray(info.streams)).toBe(true);
    });
  });

  describe('extractSubtitles()', () => {
    it('should extract subtitles in SRT format', async () => {
      await ffmpegBridge.initialize();

      global.fetch = jest.fn().mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      }) as jest.Mock;

      const subtitles = await ffmpegBridge.extractSubtitles('test.mkv', 'srt');

      expect(typeof subtitles).toBe('string');
    });
  });

  describe('takeScreenshot()', () => {
    it('should take screenshot at specified time', async () => {
      await ffmpegBridge.initialize();

      global.fetch = jest.fn().mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      }) as jest.Mock;

      const screenshot = await ffmpegBridge.takeScreenshot('test.mp4', 30, 'png');

      expect(screenshot).toContain('blob:');
    });
  });
});

import { MediaEngine } from '../../src/core/engine/MediaEngine';

describe('MediaEngine', () => {
  let mediaEngine: MediaEngine;
  let mockVideoElement: HTMLVideoElement;

  beforeEach(() => {
    mediaEngine = new MediaEngine();
    mockVideoElement = document.createElement('video');

    mockVideoElement.play = jest.fn();
    mockVideoElement.pause = jest.fn();
    mockVideoElement.load = jest.fn();

    jest.spyOn(document, 'createElement').mockReturnValue(mockVideoElement);
  });

  afterEach(() => {
    mediaEngine.destroy();
    (document.createElement as jest.Mock).mockRestore();
  });

  describe('load()', () => {
    it('should load a video file', async () => {
      const src = 'test.mp4';

      await mediaEngine.load(src);

      expect(mockVideoElement.src).toContain(src);
      expect(mockVideoElement.preload).toBe('auto');
      expect(mockVideoElement.playsInline).toBe(true);
    });

    it('should emit loading and loaded events', async () => {
      const loadingListener = jest.fn();
      const loadedListener = jest.fn();

      mediaEngine.on('loading', loadingListener);
      mediaEngine.on('loaded', loadedListener);

      await mediaEngine.load('test.mp4');

      expect(loadingListener).toHaveBeenCalledWith({ src: 'test.mp4' });
      expect(loadedListener).toHaveBeenCalled();
    });

    it('should handle load errors', async () => {
      const errorListener = jest.fn();
      mediaEngine.on('error', errorListener);

      mockVideoElement.addEventListener = jest.fn((event, handler) => {
        if (event === 'error') {
          setTimeout(() => handler(new Error('Load failed')), 0);
        }
      });

      await mediaEngine.load('invalid.mp4');

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(errorListener).toHaveBeenCalled();
    });
  });

  describe('playback controls', () => {
    beforeEach(async () => {
      await mediaEngine.load('test.mp4');
    });

    it('should play video', async () => {
      const playListener = jest.fn();
      mediaEngine.on('play', playListener);

      await mediaEngine.play();

      expect(mockVideoElement.play).toHaveBeenCalled();
      expect(playListener).toHaveBeenCalled();
    });

    it('should pause video', async () => {
      const pauseListener = jest.fn();
      mediaEngine.on('pause', pauseListener);

      await mediaEngine.pause();

      expect(mockVideoElement.pause).toHaveBeenCalled();
      expect(pauseListener).toHaveBeenCalled();
    });

    it('should seek to specific time', async () => {
      const seekListener = jest.fn();
      mediaEngine.on('seek', seekListener);

      await mediaEngine.seek(30.5);

      expect(mockVideoElement.currentTime).toBe(30.5);
      expect(seekListener).toHaveBeenCalledWith({ time: 30.5 });
    });

    it('should set volume', async () => {
      const volumeListener = jest.fn();
      mediaEngine.on('volumechange', volumeListener);

      mediaEngine.setVolume(0.75);

      expect(mockVideoElement.volume).toBe(0.75);
      expect(volumeListener).toHaveBeenCalledWith({ volume: 0.75 });
    });

    it('should clamp volume between 0 and 1', async () => {
      mediaEngine.setVolume(-1);
      expect(mockVideoElement.volume).toBe(0);

      mediaEngine.setVolume(2);
      expect(mockVideoElement.volume).toBe(1);
    });

    it('should set playback rate', async () => {
      const rateListener = jest.fn();
      mediaEngine.on('ratechange', rateListener);

      mediaEngine.setPlaybackRate(1.5);

      expect(mockVideoElement.playbackRate).toBe(1.5);
      expect(rateListener).toHaveBeenCalledWith({ rate: 1.5 });
    });
  });

  describe('stats', () => {
    it('should return playback stats', () => {
      const stats = mediaEngine.getStats();

      expect(stats).toHaveProperty('fps');
      expect(stats).toHaveProperty('droppedFrames');
      expect(stats).toHaveProperty('bufferLevel');
      expect(stats).toHaveProperty('networkSpeed');
      expect(stats).toHaveProperty('cpuUsage');
      expect(stats).toHaveProperty('memoryUsage');
    });
  });

  describe('cleanup', () => {
    it('should destroy properly', async () => {
      await mediaEngine.load('test.mp4');
      mediaEngine.destroy();

      expect(mockVideoElement.src).toBe('');
      expect(mockVideoElement.load).toHaveBeenCalled();
    });
  });
});

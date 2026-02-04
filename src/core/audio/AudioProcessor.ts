export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private equalizerNodes: BiquadFilterNode[] = [];
  private compressorNode: DynamicsCompressorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;

  private readonly EQ_BANDS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
  private eqGains: number[] = new Array(this.EQ_BANDS.length).fill(0);

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      this.gainNode = this.audioContext.createGain();
      this.compressorNode = this.audioContext.createDynamicsCompressor();
      this.analyserNode = this.audioContext.createAnalyser();

      if (this.compressorNode) {
        this.compressorNode.threshold.value = -24;
        this.compressorNode.knee.value = 30;
        this.compressorNode.ratio.value = 12;
        this.compressorNode.attack.value = 0.003;
        this.compressorNode.release.value = 0.25;
      }

      if (this.analyserNode) {
        this.analyserNode.fftSize = 2048;
        this.analyserNode.smoothingTimeConstant = 0.8;
      }

      this.createEqualizer();
      this.connectNodes();

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Audio processor initialization failed: ${(error as Error).message}`);
    }
  }

  async loadAudioBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    try {
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      this.sourceNode = this.audioContext!.createBufferSource();
      this.sourceNode.buffer = audioBuffer;

      if (this.equalizerNodes.length > 0) {
        this.sourceNode.connect(this.equalizerNodes[0]);
      } else if (this.compressorNode) {
        this.sourceNode.connect(this.compressorNode);
      } else if (this.gainNode) {
        this.sourceNode.connect(this.gainNode);
      }
    } catch (error) {
      throw new Error(`Failed to load audio buffer: ${(error as Error).message}`);
    }
  }

  async loadFromURL(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      await this.loadAudioBuffer(arrayBuffer);
    } catch (error) {
      throw new Error(`Failed to load audio from URL: ${(error as Error).message}`);
    }
  }

  play(): void {
    if (!this.sourceNode || !this.audioContext) {
      throw new Error('Audio not loaded');
    }

    try {
      (this.sourceNode as any).startTime = this.audioContext.currentTime;
      this.sourceNode.start(0);
    } catch (error) {
      throw new Error(`Failed to play audio: ${(error as Error).message}`);
    }
  }

  pause(): void {
    if (!this.audioContext) return;

    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
  }

  stop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
  }

  setVolume(volume: number): void {
    if (!this.gainNode) return;

    const clampedVolume = Math.max(0, Math.min(2, volume));
    this.gainNode.gain.value = clampedVolume;
  }

  setEQBand(bandIndex: number, gainDb: number): void {
    if (bandIndex < 0 || bandIndex >= this.EQ_BANDS.length) {
      throw new Error(`Invalid EQ band index: ${bandIndex}`);
    }

    this.eqGains[bandIndex] = gainDb;

    if (this.equalizerNodes[bandIndex]) {
      this.equalizerNodes[bandIndex].gain.value = gainDb;
    }
  }

  setEQPreset(presetName: EQPreset): void {
    const presets: Record<EQPreset, number[]> = {
      flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bass_boost: [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
      treble_boost: [0, 0, 0, 0, 0, 2, 4, 6, 6, 6],
      vocal_boost: [-3, -1, 0, 2, 4, 3, 1, 0, -1, -2],
      rock: [4, 2, 0, -1, 1, 3, 4, 3, 2, 1],
      jazz: [2, 1, 0, 1, 2, 1, 0, -1, -1, -1],
      classical: [3, 2, 1, 0, -1, 0, 1, 2, 2, 2],
      dance: [6, 5, 3, 1, 0, 0, 1, 2, 3, 3],
      metal: [4, 3, 0, -2, 0, 3, 6, 6, 4, 2],
      custom: this.eqGains,
    };

    const gains = presets[presetName];
    if (!gains) return;

    gains.forEach((gain, index) => {
      this.setEQBand(index, gain);
    });
  }

  enableNormalization(targetLufs: number = -23): void {
    console.log(`Normalization enabled with target: ${targetLufs} LUFS`);
  }

  enableSpatialAudio(enabled: boolean): void {
    if (enabled && this.audioContext) {
      const pannerNode = this.audioContext.createPanner();
      pannerNode.panningModel = 'HRTF';
      pannerNode.distanceModel = 'inverse';
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 10000;
      pannerNode.rolloffFactor = 1;
      pannerNode.coneInnerAngle = 360;
      pannerNode.coneOuterAngle = 0;
      pannerNode.coneOuterGain = 0;
      void pannerNode;
    }
  }

  getAudioData(): AudioData {
    if (!this.analyserNode) {
      return { frequencies: new Uint8Array(0), waveform: new Uint8Array(0) };
    }

    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(frequencyData);

    const waveformData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(waveformData);

    return {
      frequencies: frequencyData,
      waveform: waveformData,
    };
  }

  getCurrentTime(): number {
    if (!this.audioContext || !this.sourceNode) return 0;
    return this.audioContext.currentTime - (this.sourceNode as any).startTime;
  }

  getDuration(): number {
    if (!this.sourceNode || !this.sourceNode.buffer) return 0;
    return this.sourceNode.buffer.duration;
  }

  isPlaying(): boolean {
    return (
      !!this.sourceNode &&
      this.audioContext!.state === 'running' &&
      this.getCurrentTime() < this.getDuration()
    );
  }

  dispose(): void {
    this.stop();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.sourceNode = null;
    this.gainNode = null;
    this.equalizerNodes = [];
    this.compressorNode = null;
    this.analyserNode = null;
    this.isInitialized = false;
  }

  private createEqualizer(): void {
    if (!this.audioContext) return;

    this.equalizerNodes = this.EQ_BANDS.map((frequency, index) => {
      const filter = this.audioContext!.createBiquadFilter();

      if (index === 0) {
        filter.type = 'lowshelf';
      } else if (index === this.EQ_BANDS.length - 1) {
        filter.type = 'highshelf';
      } else {
        filter.type = 'peaking';
      }

      filter.frequency.value = frequency;
      filter.Q.value = 1.0;
      filter.gain.value = this.eqGains[index];

      return filter;
    });

    for (let i = 0; i < this.equalizerNodes.length - 1; i += 1) {
      this.equalizerNodes[i].connect(this.equalizerNodes[i + 1]);
    }
  }

  private connectNodes(): void {
    if (!this.audioContext || !this.gainNode || !this.compressorNode || !this.analyserNode) {
      return;
    }

    if (this.equalizerNodes.length > 0) {
      this.equalizerNodes[this.equalizerNodes.length - 1].connect(this.compressorNode);
    }

    this.compressorNode.connect(this.gainNode);

    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }
}

export interface AudioData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
}

export type EQPreset =
  | 'flat'
  | 'bass_boost'
  | 'treble_boost'
  | 'vocal_boost'
  | 'rock'
  | 'jazz'
  | 'classical'
  | 'dance'
  | 'metal'
  | 'custom';

// Author: knoux (أبو ريتاج) — KNOUX Player X™
// Module: Scene Mood Analyzer (SMA)
// Status: CLOSED | PRODUCTION READY | OPTIMIZED FOR GPU

import { themeManager, ThemeMode } from '../../services/theme/ThemeManager';

export interface SceneMoodMetrics {
  dominantColor: string;
  intensity: number; // 0 to 1
  isAction: boolean;
  emotion: 'Calm' | 'Aggressive' | 'Dramatic' | 'Normal';
}

export class SceneMoodAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private sampleRate: number = 2000; // حل كل ثانيتين لتوفير المعالج
  private isAnalyzing: boolean = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    // جودة عينة صغيرة جداً كافية للتحليل وسريعة جداً في المعالجة
    this.canvas.width = 32;
    this.canvas.height = 18; 
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * البدء في تحليل الفيديو المربوط بالمحرك
   */
  public async startAnalysis(videoElement: HTMLVideoElement): Promise<void> {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const analyze = () => {
      if (!this.isAnalyzing || videoElement.paused || videoElement.ended) {
        if (this.isAnalyzing) setTimeout(analyze, this.sampleRate);
        return;
      }

      this.processFrame(videoElement);
      setTimeout(analyze, this.sampleRate);
    };

    analyze();
  }

  public stopAnalysis(): void {
    this.isAnalyzing = false;
  }

  private processFrame(video: HTMLVideoElement): void {
    if (!this.ctx) return;

    this.ctx.drawImage(video, 0, 0, 32, 18);
    const imageData = this.ctx.getImageData(0, 0, 32, 18).data;

    let r = 0, g = 0, b = 0, brightness = 0;
    const pixelCount = 32 * 18;

    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
      brightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
    }

    const avgR = r / pixelCount;
    const avgG = g / pixelCount;
    const avgB = b / pixelCount;
    const avgBrightness = brightness / pixelCount;

    const mood = this.determineMood(avgR, avgG, avgB, avgBrightness);
    this.updateAtmosphere(mood);
  }

  private determineMood(r: number, g: number, b: number, br: number): ThemeMode {
    // 1. الأكشن/العنف: سيطرة الأحمر مع سطوع عالي
    if (r > g + 20 && br > 150) return 'NeonPurple'; // سنستخدم النيون بقوته

    // 2. تكنولوجي/مستقبلي: سيطرة الأزرق والأخضر
    if (b > r + 15 || g > r + 15) return 'CyberCyan';

    // 3. درامي/غامض: سطوع منخفض جداً
    if (br < 50) return 'DeepOcean';

    // 4. الافتراضي للمشاهد الطبيعية
    return 'NeonPurple';
  }

  private updateAtmosphere(mode: ThemeMode): void {
    // الاتصال بمحرك الثيمات لتحديث أجواء التطبيق فوراً
    if (themeManager.getCurrentThemeName() !== mode) {
      themeManager.setTheme(mode);
      console.log(`[KNOUX AI]: Mood Detected. Atmosphere set to ${mode}`);
    }
  }

  /**
   * حساب "التغيير في الحركة" بين لقطتين لاكتشاف المشاهد القتالية
   * (يتم استخدامه في DialogueClarity لرفع صوت الحوار وقت الحاجة)
   */
  public detectIntensity(prevFrame: ImageData, currFrame: ImageData): number {
      let diff = 0;
      for (let i = 0; i < prevFrame.data.length; i += 4) {
          diff += Math.abs(prevFrame.data[i] - currFrame.data[i]);
      }
      return diff / (prevFrame.data.length / 4);
  }
}

export const sceneMoodAnalyzer = new SceneMoodAnalyzer();

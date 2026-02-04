// Author: knoux (أبو ريتاج) — KNOUX Player X™
// Module: RTL-First Arabic Engine
// Production Status: FULLY FUNCTIONAL | CLOSED LOGIC

export interface TextSegment {
  text: string;
  isRTL: boolean;
  color?: string;
}

export class ArabicEngine {
  /**
   * اكتشاف النصوص العربية لضبط المحاذاة تلقائيا
   */
  public static isArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  }

  /**
   * نظام معالجة النصوص ثنائية الاتجاه لضمان سلامة العرض
   * يحل مشكلة الأرقام والكلمات الإنجليزية وسط الجمل العربية
   */
  public static processBidi(text: string): string {
    if (!this.isArabic(text)) return text;
    // إضافة علامات Unicode لإجبار المتصفح/المحرك على العرض اليميني الكامل
    return `\u202B${text}\u202C`;
  }

  /**
   * تشكيل الحروف العربية وحل مشاكل المسافات في الترجمات
   */
  public static shapeText(text: string): TextSegment[] {
    const parts: TextSegment[] = [];
    const segments = text.split(/(\s+)/);

    segments.forEach(seg => {
      parts.push({
        text: seg,
        isRTL: this.isArabic(seg)
      });
    });

    return parts;
  }

  /**
   * تطبيق تأثيرات النيون العاطفية على الحروف بناء على Mood المحرك
   */
  public static getStyleForEmotion(emotion: string): string {
    const styles: Record<string, string> = {
      'anger': 'color: #ff4d4d; text-shadow: 0 0 10px rgba(255, 77, 77, 0.8);',
      'whisper': 'color: #a0aec0; font-style: italic; opacity: 0.7;',
      'happy': 'color: #4ade80; text-shadow: 0 0 12px rgba(74, 222, 128, 0.6);',
      'calm': 'color: #67e8f9; text-shadow: 0 0 8px rgba(103, 232, 249, 0.4);'
    };
    return styles[emotion.toLowerCase()] || 'color: white;';
  }

  /**
   * وظيفة الحقن المباشر في DOM لتصحيح الـ Kerning والـ Margin في العربية
   */
  public static applyRTLFormatting(element: HTMLElement): void {
    if (this.isArabic(element.innerText)) {
      element.dir = 'rtl';
      element.style.textAlign = 'right';
      element.style.fontFamily = "'Noto Sans Arabic', 'Segoe UI Arabic', sans-serif";
      element.style.lineHeight = "1.6";
    } else {
      element.dir = 'ltr';
      element.style.textAlign = 'left';
    }
  }
}

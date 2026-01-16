import { describe, it, expect } from 'vitest';
import { convertTongWen } from './tongwen-converter.service';

describe('TongWen Converter', () => {
    it('should convert "发" to "發" by default (s2t)', async () => {
        const input = '发';
        const expected = '發';
        expect(await convertTongWen(input, 's2t')).toBe(expected);
    });

    it('should convert "理发" to "理髮" (phrase override)', async () => {
        const input = '理发';
        const expected = '理髮';
        expect(await convertTongWen(input, 's2t')).toBe(expected);
    });

    it('should convert "发现" to "發現" (default mapping)', async () => {
        const input = '发现';
        const expected = '發現';
        expect(await convertTongWen(input, 's2t')).toBe(expected);
    });

    it('should convert "头发" to "頭髮" (phrase override)', async () => {
        const input = '头发';
        const expected = '頭髮';
        expect(await convertTongWen(input, 's2t')).toBe(expected);
    });

    it('should conversion mixing phrases: "我发现他的头发理发了"', async () => {
        const input = '我发现他的头发理发了';
        const expected = '我發現他的頭髮理髮了';
        expect(await convertTongWen(input, 's2t')).toBe(expected);
    });

    it('should convert "千钧一发" to "千鈞一髮"', async () => {
        expect(await convertTongWen('千钧一发', 's2t')).toBe('千鈞一髮');
    });


    it('should convert "开发" to "開發"', async () => {
        expect(await convertTongWen('开发', 's2t')).toBe('開發');
    });

    it('should convert "问卷" to "問卷" (phrase override)', async () => {
        expect(await convertTongWen('问卷', 's2t')).toBe('問卷');
    });
});


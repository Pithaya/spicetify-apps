import { describe, expect, it } from 'vitest';
import { millisToMinutesAndSeconds } from './time-utils';

describe('millisToMinutesAndSeconds', () => {
    it('should convert 0 milliseconds to 0:00', () => {
        expect(millisToMinutesAndSeconds(0)).toBe('0:00');
    });

    it('should convert seconds under 10 with leading zero', () => {
        expect(millisToMinutesAndSeconds(5000)).toBe('0:05');
        expect(millisToMinutesAndSeconds(9000)).toBe('0:09');
    });

    it('should convert seconds 10 and above without leading zero', () => {
        expect(millisToMinutesAndSeconds(15000)).toBe('0:15');
        expect(millisToMinutesAndSeconds(30000)).toBe('0:30');
        expect(millisToMinutesAndSeconds(59000)).toBe('0:59');
    });

    it('should convert exact minutes correctly', () => {
        expect(millisToMinutesAndSeconds(60000)).toBe('1:00');
        expect(millisToMinutesAndSeconds(120000)).toBe('2:00');
        expect(millisToMinutesAndSeconds(300000)).toBe('5:00');
    });

    it('should convert minutes and seconds combinations', () => {
        expect(millisToMinutesAndSeconds(65000)).toBe('1:05');
        expect(millisToMinutesAndSeconds(125000)).toBe('2:05');
        expect(millisToMinutesAndSeconds(195000)).toBe('3:15');
    });

    it('should handle edge case when seconds equals 60', () => {
        // This tests the special case in the function where seconds === 60
        // results in incrementing minutes and setting seconds to 00
        expect(millisToMinutesAndSeconds(119999)).toBe('1:59');
        expect(millisToMinutesAndSeconds(120000)).toBe('2:00');
    });

    it('should handle larger time values', () => {
        expect(millisToMinutesAndSeconds(600000)).toBe('10:00'); // 10 minutes
        expect(millisToMinutesAndSeconds(3600000)).toBe('60:00'); // 1 hour (60 minutes)
        expect(millisToMinutesAndSeconds(3665000)).toBe('61:05'); // 1 hour 1 minute 5 seconds
    });

    it('should handle fractional seconds by flooring', () => {
        expect(millisToMinutesAndSeconds(5999)).toBe('0:05'); // 5.999 seconds -> 5 seconds
        expect(millisToMinutesAndSeconds(59999)).toBe('0:59'); // 59.999 seconds -> 59 seconds
        expect(millisToMinutesAndSeconds(65999)).toBe('1:05'); // 65.999 seconds -> 1:05
    });

    it('should handle very small non-zero values', () => {
        expect(millisToMinutesAndSeconds(1)).toBe('0:00');
        expect(millisToMinutesAndSeconds(999)).toBe('0:00');
    });
});

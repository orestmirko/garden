import dayjs, { ManipulateType } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(advancedFormat);

export class TimeHelper {
  /**
   * Converts a duration string (e.g., "1 year") into its equivalent in seconds.
   * The function splits the input into value and unit, then calculates the duration.
   *
   * @param {string} configString - The duration string to be converted, composed of a value and a time unit (e.g., "1 year").
   * @returns {number} The duration in seconds.
   */
  public static getDurationFromString(configString: string): number {
    const [value, unit] = configString.split(' ');
    return dayjs.duration(Number(value), unit as ManipulateType).asSeconds();
  }
}

/**
 * formatRelative(date[, options])
 *
 * @param {Date|string|number} date - date to format (Date object, ISO string or epoch ms)
 * @param {Object} [options]
 * @param {'short'|'long'} [options.style='short'] - output style
 * @param {number|Date} [options.now=Date.now()] - reference "now" (useful for tests)
 * @returns {string} human readable relative time
 */

export function relativeTime(date, options = {}) {
  const { style = 'short', now = Date.now() } = options;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return ''; // invalid date

  const ms = +now - d.getTime();
  const absMs = Math.abs(ms);
  const isFuture = ms < 0;

  const sec = Math.floor(absMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30); // approx
  const year = Math.floor(day / 365); // approx

  const S =
    style === 'long'
      ? {
          s: 'second',
          ss: 'seconds',
          m: 'minute',
          mm: 'minutes',
          h: 'hour',
          hh: 'hours',
          d: 'day',
          dd: 'days',
          w: 'week',
          ww: 'weeks',
          mo: 'month',
          mos: 'months',
          y: 'year',
          yy: 'years',
          justNow: 'just now',
          yesterday: 'yesterday',
          tomorrow: 'tomorrow',
          lastWeek: 'last week',
          nextWeek: 'next week',
          lastMonth: 'last month',
          nextMonth: 'next month',
          lastYear: 'last year',
          nextYear: 'next year',
          inPrefix: 'in',
          agoSuffix: 'ago',
        }
      : {
          s: 'sec',
          ss: 'sec',
          m: 'min',
          mm: 'min',
          h: 'hr',
          hh: 'hr',
          d: 'day',
          dd: 'day',
          w: 'wk',
          ww: 'wk',
          mo: 'mo',
          mos: 'mo',
          y: 'yr',
          yy: 'yr',
          justNow: 'just now',
          yesterday: 'yesterday',
          tomorrow: 'tomorrow',
          lastWeek: 'last week',
          nextWeek: 'next week',
          lastMonth: 'last month',
          nextMonth: 'next month',
          lastYear: 'last year',
          nextYear: 'next year',
          inPrefix: 'in',
          agoSuffix: 'ago',
        };

  // Very recent
  if (sec < 5) return S.justNow;

  // Seconds
  if (sec < 60) {
    const n = sec;
    return isFuture ? `${S.inPrefix} ${n} ${S.ss}` : `${n} ${S.ss} ${S.agoSuffix}`;
  }

  // Minutes
  if (min < 60) {
    const n = Math.floor(min);
    return isFuture ? `${S.inPrefix} ${n} ${S.mm}` : `${n} ${S.mm} ${S.agoSuffix}`;
  }

  // Hours
  if (hr < 24) {
    const n = Math.floor(hr);
    return isFuture ? `${S.inPrefix} ${n} ${S.hh}` : `${n} ${S.hh} ${S.agoSuffix}`;
  }

  // Days
  if (day === 1) return isFuture ? S.tomorrow : S.yesterday;
  if (day < 7) {
    const n = Math.floor(day);
    return isFuture ? `${S.inPrefix} ${n} ${S.dd}` : `${n} ${S.dd} ${S.agoSuffix}`;
  }

  // Weeks
  if (week < 5) {
    const n = Math.floor(week);
    if (n === 1) return isFuture ? S.nextWeek : S.lastWeek;
    return isFuture ? `${S.inPrefix} ${n} ${S.ww}` : `${n} ${S.ww} ${S.agoSuffix}`;
  }

  // Months
  if (month < 12) {
    const n = Math.floor(month);
    if (n === 1) return isFuture ? S.nextMonth : S.lastMonth;
    return isFuture ? `${S.inPrefix} ${n} ${S.mos}` : `${n} ${S.mos} ${S.agoSuffix}`;
  }

  // Years
  const n = Math.floor(year);
  if (n === 1) return isFuture ? S.nextYear : S.lastYear;
  return isFuture ? `${S.inPrefix} ${n} ${S.yy}` : `${n} ${S.yy} ${S.agoSuffix}`;
}

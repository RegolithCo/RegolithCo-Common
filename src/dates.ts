import { isUndefined } from 'lodash'
import dayjs from 'dayjs'

/**
 * This function returns the short form of the current timezone.
 * It creates a new Date object and uses the toLocaleTimeString method
 * to get a string representing the time portion of the date in US English
 * and in a short form like 'PDT'. The string is then split into an array
 * and the third element (the timezone) is returned.
 */
export function getTimezoneStr() {
  return new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
}

export function smartDate(dateMs: number) {
  const now = Date.now()
  const isYesterday = dayjs(now).subtract(1, 'day').isSame(dateMs, 'day')
  const isToday = dayjs(now).isSame(dateMs, 'day')
  const isTomorrow = dayjs(now).add(1, 'day').isSame(dateMs, 'day')
  if (isToday) return `Today ${dayjs(dateMs).format('h:mm a')} (${getTimezoneStr()})`
  else if (isYesterday) return `Yesterday ${dayjs(dateMs).format('h:mm a')} (${getTimezoneStr()})`
  else if (isTomorrow) return `Tomorrow ${dayjs(dateMs).format('h:mm a')} (${getTimezoneStr()})`
  else return `${dayjs(dateMs).format('MMM D, YYYY, h:mm a')} (${getTimezoneStr()})`
}

/**
 * Function to parse a number of milliseconds into the format 00d 00h 00m 00s
 */
export function readableMilliseconds(milliseconds: number, includeSeconds = true, humanize = true): string {
  if (milliseconds === null || isUndefined(milliseconds) || milliseconds < 0) return '???'

  // get days from milliseconds
  const days = milliseconds / (1000 * 60 * 60 * 24) + Number.EPSILON
  const absoluteDays = Math.floor(days)
  const d = absoluteDays

  //Get hours from milliseconds
  const hours = (days - absoluteDays) * 24
  const absoluteHours = Math.floor(hours)
  const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours

  //Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60
  const absoluteMinutes = Math.floor(minutes)
  const m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes

  //Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60
  const absoluteSeconds = Math.round(seconds)
  const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds

  if (humanize) {
    const secondsString: string = includeSeconds ? ' ' + s + 's' : ''
    if (absoluteDays > 0) return d + 'd ' + h + 'h ' + m + 'm' + secondsString
    else if (absoluteHours > 0) return absoluteHours + 'h ' + m + 'm' + secondsString
    else if (absoluteMinutes > 0) return absoluteMinutes + 'm' + secondsString
    else return s + 's'
  } else {
    const durArr = []
    if (d > 0) durArr.push(d)
    durArr.push(h)
    durArr.push(m)
    if (includeSeconds && absoluteSeconds > 0) durArr.push(s)

    return durArr.map((v) => v.toString().padStart(2, '0')).join(':')
  }
}

export function getTodayTimestamp() {
  const today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  return today.getTime();
}

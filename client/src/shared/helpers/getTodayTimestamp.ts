export function getTodayTimestamp() {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  return today.getTime();
}

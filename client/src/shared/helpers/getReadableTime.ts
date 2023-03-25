export function getReadbleTime(time: number) {
  const timeString = time.toString().padStart(4, '0');
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2);
  return `${hours}:${minutes}`;
}

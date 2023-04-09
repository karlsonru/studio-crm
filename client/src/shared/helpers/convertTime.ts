export function convertTime(time: number) {
  const hh = Math.floor(time / 100).toString().padStart(2, '0');
  const min = (time % 100).toString().padStart(2, '0');
  return `${hh}:${min}`;
}

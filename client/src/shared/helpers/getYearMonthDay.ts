export function getYearMonthDay(timestamp: number) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return { year, month, day };
}

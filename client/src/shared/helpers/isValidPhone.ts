export function isValidPhone(phone: string) {
  return (/^(79)\d{9}/g).test(phone);
}

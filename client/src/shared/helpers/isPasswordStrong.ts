export function isPasswordStrong(password: string): boolean {
  return (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/g).test(password);
}

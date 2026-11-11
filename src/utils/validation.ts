const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^(0|\+84)(\d{9,10})$/;

export interface PersonalFields {
  fullName: string;
  email: string;
  phone: string;
}

export type PersonalFieldErrors = Partial<Record<keyof PersonalFields, string>>;

export function validatePersonalFields(values: PersonalFields): PersonalFieldErrors {
  const errors: PersonalFieldErrors = {};
  if (isBlank(values.fullName)) errors.fullName = 'Vui lòng nhập họ tên';
  else if (values.fullName.trim().length < 2) errors.fullName = 'Họ tên cần ít nhất 2 ký tự';

  if (isBlank(values.email)) errors.email = 'Vui lòng nhập email';
  else if (!isValidEmail(values.email)) errors.email = 'Email chưa đúng định dạng, ví dụ: ten@gmail.com';

  if (isBlank(values.phone)) errors.phone = 'Vui lòng nhập số điện thoại';
  else if (!isValidPhone(values.phone)) errors.phone = 'Số điện thoại chưa đúng, ví dụ: 0912 345 678';

  return errors;
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.replace(/[\s.-]/g, ''));
}

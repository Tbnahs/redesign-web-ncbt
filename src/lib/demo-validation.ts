import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email.")
  .max(254, "Email không được vượt quá 254 ký tự.")
  .email("Email chưa đúng định dạng.");

const passwordField = z
  .string()
  .min(6, "Mật khẩu cần có ít nhất 6 ký tự.")
  .max(100, "Mật khẩu không được vượt quá 100 ký tự.");

export const signInSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập họ tên.")
      .max(100, "Họ tên không được vượt quá 100 ký tự."),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại chưa khớp.",
  });

export const newsletterSchema = z.object({ email: emailField });

export const siteSearchQuerySchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập từ khóa cần tìm.")
  .max(120, "Từ khóa không được vượt quá 120 ký tự.");

export function validateSiteSearchParams(search: Record<string, unknown>) {
  const result = siteSearchQuerySchema.safeParse(search["q"]);
  return { q: result.success ? result.data : "" };
}

export function getFormErrors(error: z.ZodError) {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).flatMap(([field, messages]) =>
      messages?.[0] ? [[field, messages[0]]] : [],
    ),
  );
}

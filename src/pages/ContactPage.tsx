import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { FormField, inputClass } from "@/components/common/FormField";
import { FormSuccess } from "@/components/common/FormSuccess";
import { brand } from "@/config/brand";
import { isBlank, validatePersonalFields, type PersonalFieldErrors } from "@/utils/validation";

interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FieldErrors = PersonalFieldErrors & {
  subject?: string;
  message?: string;
};

const initialForm: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const contactItems = [
  { label: "Địa chỉ", icon: MapPin, content: brand.address, href: undefined },
  ...brand.hotlines.map((hotline) => ({
    label: "Điện thoại",
    icon: Phone,
    content: hotline,
    href: `tel:${hotline.replace(/\s/g, "")}`,
  })),
  { label: "Email", icon: Mail, content: brand.email, href: `mailto:${brand.email}` },
];

const mapEmbedSrc =
  "https://www.google.com/maps?q=S%E1%BB%91+8+Ho%C3%A0ng+Qu%E1%BB%91c+Vi%E1%BB%87t,+Ngh%C4%A9a+%C4%90%C3%B4,+C%E1%BA%A7u+Gi%E1%BA%A5y,+H%C3%A0+N%E1%BB%99i&output=embed";

export function ContactPage() {
  const [form, setForm] = useState<ContactFormValues>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const personal = validatePersonalFields({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
    });
    const next: FieldErrors = { ...personal };

    if (isBlank(form.subject)) {
      next.subject = "Vui lòng nhập chủ đề";
    } else if (form.subject.trim().length < 5) {
      next.subject = "Chủ đề cần ít nhất 5 ký tự";
    }
    if (isBlank(form.message)) {
      next.message = "Vui lòng nhập nội dung tin nhắn";
    } else if (form.message.trim().length < 10) {
      next.message = "Nội dung cần ít nhất 10 ký tự";
    }

    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="hover:text-primary-600">
          Trang chủ
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-navy-900">Liên hệ</span>
      </nav>

      <h1 className="mt-6 border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">
        Liên hệ
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">
        Gửi câu hỏi hoặc yêu cầu tư vấn đến Trung tâm Mã số, Mã vạch Quốc gia qua một trong các kênh
        dưới đây.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {contactItems.map(({ label, icon: Icon, content, href }, index) => {
          const body = (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">{label}</p>
              <p className="font-bold leading-relaxed text-navy-900">{content}</p>
            </>
          );
          const cardClass =
            "flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300";
          return href ? (
            <a
              key={`${label}-${index}`}
              href={href}
              className={`${cardClass} hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg`}
            >
              {body}
            </a>
          ) : (
            <div key={`${label}-${index}`} className={cardClass}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="border-l-4 border-primary-500 pl-4 text-xl font-bold text-navy-900 sm:text-2xl">
            Gửi tin nhắn
          </h2>
          <p className="mt-3 text-neutral-600">
            Điền thông tin bên dưới, Trung tâm sẽ phản hồi qua email hoặc điện thoại.
          </p>
          <p
            role="note"
            className="mt-3 border-l-2 border-accent-500 pl-3 text-sm text-neutral-600"
          >
            Đây là bản xem trước; nội dung gửi ở đây chưa được lưu hoặc chuyển tới Trung tâm.
          </p>

          {submitted ? (
            <div className="mt-8">
              <FormSuccess
                title="Đã kiểm tra biểu mẫu"
                message="Bản xem trước chưa gửi hoặc lưu tin nhắn của bạn."
                actionLabel="Gửi tin nhắn khác"
                onReset={handleReset}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="contact-fullName" label="Họ và tên" required error={errors.fullName}>
                  <input
                    id="contact-fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={inputClass}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                </FormField>
                <FormField id="contact-phone" label="Số điện thoại" required error={errors.phone}>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="0912 345 678"
                    className={inputClass}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </FormField>
              </div>

              <FormField id="contact-email" label="Email" required error={errors.email}>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="ten@gmail.com"
                  className={inputClass}
                  aria-invalid={Boolean(errors.email)}
                />
              </FormField>

              <FormField id="contact-subject" label="Chủ đề" required error={errors.subject}>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  placeholder="Nhập chủ đề tin nhắn"
                  className={inputClass}
                  aria-invalid={Boolean(errors.subject)}
                />
              </FormField>

              <FormField id="contact-message" label="Nội dung" required error={errors.message}>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Mô tả chi tiết yêu cầu của bạn"
                  className={`${inputClass} resize-y`}
                  aria-invalid={Boolean(errors.message)}
                />
              </FormField>

              <button
                type="submit"
                className="rounded-md bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600"
              >
                Gửi tin nhắn
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 className="border-l-4 border-primary-500 pl-4 text-xl font-bold text-navy-900 sm:text-2xl">
            Vị trí Trung tâm
          </h2>
          <p className="mt-3 text-neutral-600">{brand.address}</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
            <iframe
              title="Bản đồ vị trí Trung tâm"
              src={mapEmbedSrc}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

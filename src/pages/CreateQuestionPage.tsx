import { useState, type FormEvent } from "react";
import { SectionLayout } from "@/components/common/SectionLayout";
import { FormField, inputClass } from "@/components/common/FormField";
import { FormSuccess } from "@/components/common/FormSuccess";
import { qaTopics } from "@/data/qaRepository";
import { isBlank, validatePersonalFields, type PersonalFieldErrors } from "@/utils/validation";

interface QuestionFormValues {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  title: string;
  content: string;
}

type FieldErrors = PersonalFieldErrors & {
  topic?: string;
  title?: string;
  content?: string;
};

const initialForm: QuestionFormValues = {
  fullName: "",
  email: "",
  phone: "",
  topic: "",
  title: "",
  content: "",
};

export function CreateQuestionPage() {
  const [form, setForm] = useState<QuestionFormValues>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof QuestionFormValues>(
    key: K,
    value: QuestionFormValues[K],
  ) => {
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

    if (isBlank(form.topic)) next.topic = "Vui lòng chọn chủ đề";
    if (isBlank(form.title)) {
      next.title = "Vui lòng nhập tiêu đề câu hỏi";
    } else if (form.title.trim().length < 5) {
      next.title = "Tiêu đề cần ít nhất 5 ký tự";
    }
    if (isBlank(form.content)) {
      next.content = "Vui lòng nhập nội dung câu hỏi";
    } else if (form.content.trim().length < 10) {
      next.content = "Nội dung cần ít nhất 10 ký tự";
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
    <SectionLayout path="/hoi-dap/tao-cau-hoi" title="Tạo câu hỏi">
      <header className="space-y-4">
        <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">
          Tạo câu hỏi
        </h1>
        <p className="text-lg leading-relaxed text-neutral-600">
          Gửi câu hỏi của bạn đến Trung tâm. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <p role="note" className="border-l-2 border-accent-500 pl-3 text-sm text-neutral-600">
          Đây là bản xem trước; câu hỏi chưa được lưu hoặc chuyển tới Trung tâm.
        </p>
      </header>

      {submitted ? (
        <div className="mt-10">
          <FormSuccess
            title="Đã kiểm tra biểu mẫu"
            message="Bản xem trước chưa gửi hoặc lưu câu hỏi của bạn."
            actionLabel="Gửi câu hỏi khác"
            onReset={handleReset}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField id="fullName" label="Họ và tên" required error={errors.fullName}>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Nguyễn Văn A"
                className={inputClass}
                aria-invalid={Boolean(errors.fullName)}
              />
            </FormField>
            <FormField id="phone" label="Số điện thoại" required error={errors.phone}>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="0912 345 678"
                className={inputClass}
                aria-invalid={Boolean(errors.phone)}
              />
            </FormField>
          </div>

          <FormField id="email" label="Email" required error={errors.email}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="ten@gmail.com"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
            />
          </FormField>

          <FormField id="topic" label="Chủ đề" required error={errors.topic}>
            <select
              id="topic"
              value={form.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.topic)}
            >
              <option value="">— Chọn chủ đề —</option>
              {qaTopics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="title" label="Tiêu đề câu hỏi" required error={errors.title}>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Nhập tiêu đề ngắn gọn cho câu hỏi"
              className={inputClass}
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>

          <FormField id="content" label="Nội dung câu hỏi" required error={errors.content}>
            <textarea
              id="content"
              rows={5}
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Mô tả chi tiết câu hỏi của bạn"
              className={`${inputClass} resize-y`}
              aria-invalid={Boolean(errors.content)}
            />
          </FormField>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="rounded-md bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600"
            >
              Gửi câu hỏi
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-700 transition-colors duration-200 hover:bg-neutral-100"
            >
              Xóa form
            </button>
          </div>
        </form>
      )}
    </SectionLayout>
  );
}

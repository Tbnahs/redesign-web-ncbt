import { useState, type FormEvent } from "react";
import { SourceBreadcrumbs, SourceSidebar } from "@/components/reference/SourceNews";
import { useLocale } from "@/i18n";
export function CreateQuestionPage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const records = JSON.parse(localStorage.getItem("ncbt-questions") || "[]");
    localStorage.setItem(
      "ncbt-questions",
      JSON.stringify([...records, { ...data, createdAt: new Date().toISOString() }]),
    );
    e.currentTarget.reset();
    setSent(true);
  }
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={vi ? "Tạo câu hỏi" : "Ask a question"} />
      <div className="source-page-grid">
        <section>
          <h1 className="source-page-title">{vi ? "Tạo câu hỏi" : "Ask a question"}</h1>
          <form className="source-form" onSubmit={submit}>
            <label>
              {vi ? "Tiêu đề:" : "Title:"}
              <input
                name="title"
                placeholder={vi ? "Tóm tắt câu hỏi" : "Question summary"}
                required
                maxLength={250}
              />
            </label>
            <label>
              {vi ? "Nội dung:" : "Content:"}
              <textarea
                name="content"
                placeholder={vi ? "Mô tả nội dung" : "Describe your question"}
                required
                rows={7}
                maxLength={5000}
              />
            </label>
            <label className="source-checkbox">
              <input type="checkbox" required />
              {vi ? "Tôi chấp nhận quy định và điều khoản" : "I accept the terms and conditions"}
            </label>
            <button className="source-button">{vi ? "Gửi câu hỏi" : "Send question"}</button>
            {sent && (
              <p role="status">
                {vi ? "Đã lưu câu hỏi trên bản xem thử." : "Question saved in this local preview."}
              </p>
            )}
          </form>
        </section>
        <SourceSidebar />
      </div>
    </div>
  );
}

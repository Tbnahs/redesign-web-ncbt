import { useState, type FormEvent } from "react";
import { SourceBreadcrumbs, SourceSidebar } from "@/components/reference/SourceNews";
import { useLocale } from "@/i18n";
import { addEvent, notifyDemo } from "@/data/demo-admin-store";
export function ContactPage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError("");
    setSent(false);
    try {
      const records = JSON.parse(localStorage.getItem("ncbt-contacts") || "[]");
      localStorage.setItem(
        "ncbt-contacts",
        JSON.stringify([...records, { ...data, createdAt: new Date().toISOString() }]),
      );
      addEvent("Liên hệ", String(data["name"] || "Khách"));
      notifyDemo();
      setSent(true);
      form.reset();
    } catch {
      setError(
        vi
          ? "Không lưu được liên hệ. Vui lòng thử lại; thông tin đã nhập vẫn được giữ."
          : "Unable to save your message. Your input is kept so you can retry.",
      );
    }
  }
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={vi ? "Liên hệ" : "Contact"} />
      <div className="source-page-grid">
        <section>
          <h1 className="source-page-title">{vi ? "Liên hệ" : "Contact"}</h1>
          <p className="source-contact-intro">
            {vi
              ? "Khi nhận được email của bạn, chúng tôi sẽ cố gắng trả lời sớm nhất có thể để trả lời câu hỏi của bạn. Cám ơn bạn rất nhiều."
              : "When we receive your email, we will try to respond as soon as possible to answer your question. Thank you very much."}
          </p>
          <form className="source-form" onSubmit={submit}>
            {error && (
              <p className="adm-error" role="alert">
                {error}
              </p>
            )}
            <label>
              {vi ? "Tên:" : "Name:"}
              <input name="name" autoComplete="name" required maxLength={150} />
            </label>
            <label>
              Email:
              <input name="email" type="email" autoComplete="email" required maxLength={200} />
            </label>
            <label>
              {vi ? "Mục đích liên hệ:" : "Purpose:"}
              <select name="purpose" required defaultValue="">
                <option value="" disabled>
                  {vi ? "Chọn mục đích liên hệ" : "Select a purpose"}
                </option>
                <option value="support">{vi ? "Liên hệ hỗ trợ" : "Support"}</option>
                <option value="cooperation">{vi ? "Liên hệ cộng tác" : "Cooperation"}</option>
                <option value="complaint">
                  {vi ? "Thắc mắc, khiếu nại" : "Questions, complaints"}
                </option>
              </select>
            </label>
            <label>
              {vi ? "Nội dung tin nhắn" : "Message"}
              <textarea name="message" required rows={6} maxLength={5000} />
            </label>
            <button className="source-button">{vi ? "Gửi" : "Send"}</button>
            {sent && (
              <p role="status">
                {vi
                  ? "Đã lưu liên hệ trên bản xem thử. Nội dung không được gửi đến hệ thống NBC gốc."
                  : "Message saved in this preview. It has not been sent to the original NBC system."}
              </p>
            )}
          </form>
        </section>
        <SourceSidebar />
      </div>
    </div>
  );
}

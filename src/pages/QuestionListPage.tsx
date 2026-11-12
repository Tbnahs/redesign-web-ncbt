import { useEffect, useState } from "react";
import { SourceBreadcrumbs, SourceSidebar } from "@/components/reference/SourceNews";
import { useLocale } from "@/i18n";
export function QuestionListPage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [questions, setQuestions] = useState<
    { title: string; content: string; createdAt: string }[]
  >([]);
  useEffect(() => {
    try {
      setQuestions(JSON.parse(localStorage.getItem("ncbt-questions") || "[]"));
    } catch {}
  }, []);
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={vi ? "Danh sách câu hỏi" : "Questions"} />
      <div className="source-page-grid">
        <section>
          <h1 className="source-page-title">{vi ? "Danh sách câu hỏi" : "Questions"}</h1>
          {questions.map((q, i) => (
            <details className="source-question" key={i}>
              <summary>{q.title}</summary>
              <p>{q.content}</p>
            </details>
          ))}
        </section>
        <SourceSidebar />
      </div>
    </div>
  );
}

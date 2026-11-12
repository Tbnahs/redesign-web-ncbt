import { useEffect, useState, type FormEvent } from "react";
import {
  usePublicArticles,
  useDemoRevision,
  notifyDemo,
  recordArticleView,
} from "@/data/demo-admin-store";
import { useDemoHtml, useDemoMediaUrl } from "@/lib/demo-media";
import {
  SourceBreadcrumbs,
  SourceSidebar,
  SourcePhoto,
  ArticleLink,
  sourceDate,
} from "@/components/reference/SourceNews";
import { NotFoundPage } from "./NotFoundPage";
import { useLocale } from "@/i18n";
import { sourceHtml } from "@/lib/source-html";
export function NewsDetailPage({ slug }: { slug: string }) {
  const articles = usePublicArticles();
  const a = articles.find((article) => article.slug === slug);
  const revision = useDemoRevision();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (a) recordArticleView(slug);
  }, [slug, !!a]);
  const body = useDemoHtml(sourceHtml(a?.content || ""));
  const videoUrl = useDemoMediaUrl(a?.video || "", "");
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [comments, setComments] = useState<{ name: string; text: string }[]>([]);
  const [notice, setNotice] = useState("");
  const [videoError, setVideoError] = useState(false);
  useEffect(() => setVideoError(false), [videoUrl]);
  useEffect(() => {
    setNotice("");
    setVideoError(false);
  }, [slug]);
  useEffect(() => {
    try {
      setComments(JSON.parse(localStorage.getItem("ncbt-comments:" + slug) || "[]"));
    } catch {
      setComments([]);
    }
  }, [slug, revision]);
  if (!ready)
    return (
      <div className="source-container source-article-loading" role="status">
        Đang tải bài viết…
      </div>
    );
  if (!a) return <NotFoundPage />;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    const next = [
      ...comments,
      {
        id: crypto.randomUUID(),
        name: String(data.get("name")).trim(),
        text: String(data.get("text")).trim(),
        createdAt: new Date().toISOString(),
      },
    ];
    try {
      localStorage.setItem("ncbt-comments:" + slug, JSON.stringify(next));
    } catch {
      setNotice(
        vi
          ? "Không lưu được bình luận. Nội dung vẫn được giữ để bạn thử lại."
          : "Unable to save your comment. Your input is kept so you can retry.",
      );
      return;
    }
    setComments(next);
    notifyDemo();
    setNotice(
      vi ? "Đã lưu bình luận trên bản xem thử này." : "Comment saved in this local preview.",
    );
    f.reset();
  }
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={vi ? "Tin tức" : "News"} />
      <div className="source-page-grid">
        <article className="source-detail">
          <h1>{a.title}</h1>
          <div className="source-article-meta">
            <time>{sourceDate(a.date)}</time>
            <button onClick={() => window.print()}>{vi ? "In bài viết" : "Print"}</button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(location.href);
                setNotice(vi ? "Đã sao chép liên kết." : "Link copied.");
              }}
            >
              {vi ? "Chia sẻ" : "Share"}
            </button>
          </div>
          <p className="source-summary">{a.summary}</p>
          {a.kind === "image" && a.thumbnail && !a.content.includes(a.thumbnail) && (
            <figure className="source-article-cover">
              <SourcePhoto article={a} />
            </figure>
          )}
          {a.kind === "video" && a.video && (
            <video
              className="source-article-video"
              src={videoUrl || undefined}
              controls
              preload="metadata"
              onError={() => setVideoError(true)}
            />
          )}
          {videoError && (
            <p role="alert" className="adm-error">
              {vi
                ? "Không thể phát tệp video. Vui lòng kiểm tra tệp hoặc thử lại."
                : "Unable to play this video. Please check the file or try again."}
            </p>
          )}
          <div
            className="source-article-body"
            dangerouslySetInnerHTML={{ __html: body }}
            onErrorCapture={(e) => {
              if (
                e.target instanceof HTMLImageElement &&
                !e.target.src.endsWith("news-placeholder.svg")
              ) {
                e.target.src = "/images/news-placeholder.svg";
                e.target.alt = "Ảnh minh họa thay cho ảnh gốc không còn truy cập được";
              }
            }}
          />
          <div className="source-comment-block">
            <h2>
              {vi ? "Bình luận" : "Comments"} ({comments.length})
            </h2>
            {comments.map((c, i) => (
              <div className="source-comment" key={i}>
                <b>{c.name}</b>
                <p>{c.text}</p>
              </div>
            ))}
            <form onSubmit={submit} className="source-form">
              <label>
                {vi ? "Họ và tên" : "Your name"}
                <input name="name" required maxLength={100} />
              </label>
              <label>
                {vi ? "Nội dung bình luận" : "Comment"}
                <textarea name="text" required maxLength={3000} rows={4} />
              </label>
              <button className="source-button">{vi ? "Gửi bình luận" : "Post comment"}</button>
            </form>
          </div>
          <p role="status">{notice}</p>
          <h2 className="source-related-title">{vi ? "Tin liên quan" : "Related news"}</h2>
          <div className="source-related-grid">
            {articles
              .filter((n) => n.slug !== slug && n.category === a.category)
              .slice(0, 4)
              .map((n) => (
                <article key={n.slug}>
                  <ArticleLink article={n}>
                    <SourcePhoto article={n} />
                  </ArticleLink>
                  <h3>
                    <ArticleLink article={n} />
                  </h3>
                </article>
              ))}
          </div>
        </article>
        <SourceSidebar />
      </div>
    </div>
  );
}

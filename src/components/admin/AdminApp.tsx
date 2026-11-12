import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Newspaper,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  Menu,
  Search,
  Maximize,
  Mail,
  Power,
  UserRound,
  Globe,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Pencil,
  Plus,
  ArrowLeft,
  MessageSquare,
  TrendingUp,
  Bookmark,
  Gem,
  ExternalLink,
  Check,
  Upload,
  Image as ImageIcon,
  Video,
  AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UkFlag, VietnamFlag } from "@/components/icons/FlagIcons";
import { useLocale, type Locale } from "@/i18n";
import {
  useAdminArticles,
  useDemoRevision,
  categoryGroups,
  categories,
  categoryName,
  toSlug,
  saveArticle,
  toggleArticle,
  deleteArticle,
  getAdminArticles,
  getComments,
  removeComment,
  getContacts,
  getEvents,
  addEvent,
  notifyDemo,
  type AdminArticle,
  type DemoComment,
  type DemoContact,
} from "@/data/demo-admin-store";
import {
  saveDemoMedia,
  useDemoMediaUrl,
  useDemoHtml,
  sanitizeEditorHtml,
  discardUnusedMedia,
} from "@/lib/demo-media";
import { RichEditor } from "./RichEditor";
import { verifyDemoAdmin, setDemoPassword } from "@/lib/demo-auth";

export type AdminView =
  "dashboard" | "posts" | "editor" | "comments" | "contacts" | "profile" | "training";
type Navigate = (view: AdminView, id?: string, q?: string) => void;
const Context = createContext<{
  vi: boolean;
  tr: (vi: string, en: string) => string;
  rows: AdminArticle[];
  navigate: Navigate;
  flash: (text: string) => void;
}>({ vi: true, tr: (s) => s, rows: [], navigate: () => {}, flash: () => {} });
const useAdmin = () => useContext(Context);
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
const dateTime = (s: string) =>
  s ? new Date(s).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—";
function MediaImage({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const url = useDemoMediaUrl(src);
  return (
    <img
      src={url || "/images/news-placeholder.svg"}
      alt={alt}
      className={className}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith("news-placeholder.svg"))
          e.currentTarget.src = "/images/news-placeholder.svg";
      }}
    />
  );
}
function MediaVideo({ src }: { src: string }) {
  const url = useDemoMediaUrl(src, "");
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [url]);
  return (
    <>
      <video
        className="adm-video"
        src={url || undefined}
        controls
        preload="metadata"
        onError={() => setError(true)}
      />
      {error && (
        <p className="adm-error">Không thể phát tệp video này. Vui lòng kiểm tra tệp và thử lại.</p>
      )}
    </>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return <div className="adm-empty">{children}</div>;
}
export function AdminApp({
  view,
  id,
  q,
  onNavigate,
}: {
  view: AdminView;
  id: string;
  q: string;
  onNavigate: Navigate;
}) {
  const { locale, setLocale } = useLocale();
  const vi = locale === "vi";
  const tr = (v: string, e: string) => (vi ? v : e);
  const rows = useAdminArticles();
  useDemoRevision();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [newsOpen, setNewsOpen] = useState(true);
  const [search, setSearch] = useState(q);
  const [toast, setToast] = useState("");
  const [profileName, setProfileName] = useState("Admin NCBT");
  const [logout, setLogout] = useState(false);
  useEffect(() => {
    setReady(true);
    if (innerWidth < 800) setCollapsed(true);
    setAuthed(sessionStorage.getItem("ncbt-admin-auth") === "1");
    try {
      setProfileName(
        JSON.parse(localStorage.getItem("ncbt-admin-profile") || "{}").name || "Admin NCBT",
      );
    } catch {}
  }, []);
  useEffect(() => setSearch(q), [q]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);
  function navigate(next: AdminView, nextId = "", nextQ = "") {
    onNavigate(next, nextId, nextQ);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (innerWidth < 800) setCollapsed(true);
  }
  if (!ready) return <div className="adm-loading">NCBT…</div>;
  if (!authed)
    return (
      <AdminLogin
        onLogin={() => {
          sessionStorage.setItem("ncbt-admin-auth", "1");
          setAuthed(true);
        }}
      />
    );
  const comments = getComments();
  const contacts = getContacts();
  return (
    <Context.Provider value={{ vi, tr, rows, navigate, flash: setToast }}>
      <div className={`adm-shell ${collapsed ? "is-collapsed" : ""}`}>
        <aside className="adm-sidebar">
          <Link to="/" className="adm-logo">
            <img src="/branding/ncbt-logo-original.jpg" alt="NCBT" />
          </Link>
          <nav aria-label={tr("Quản trị", "Administration")}>
            <button
              className={view === "dashboard" ? "active" : ""}
              onClick={() => navigate("dashboard")}
            >
              <span>Dashboard</span>
              <Home size={17} />
            </button>
            <button
              className={["posts", "editor"].includes(view) ? "active" : ""}
              onClick={() => setNewsOpen(!newsOpen)}
              aria-expanded={newsOpen}
            >
              <span>{tr("Tin tức", "News")}</span>
              <ChevronLeft size={14} className={newsOpen ? "adm-rotate" : ""} />
              <Newspaper size={17} />
            </button>
            {newsOpen && (
              <div className="adm-submenu">
                <button
                  className={view === "posts" ? "active" : ""}
                  onClick={() => navigate("posts")}
                >
                  {tr("Danh sách", "List")}
                </button>
                <button
                  className={view === "editor" && !id ? "active" : ""}
                  onClick={() => navigate("editor")}
                >
                  {tr("Thêm mới", "Add new")}
                </button>
              </div>
            )}
            <button
              className={view === "training" ? "active" : ""}
              onClick={() => navigate("training")}
            >
              <span>{tr("Đào tạo", "Training")}</span>
              <ChevronLeft size={14} />
              <BookOpen size={17} />
            </button>
            <button
              className={view === "comments" ? "active" : ""}
              onClick={() => navigate("comments")}
            >
              <span>{tr("Bình luận", "Comments")}</span>
              <MessageSquare size={17} />
            </button>
            <button
              className={view === "contacts" ? "active" : ""}
              onClick={() => navigate("contacts")}
            >
              <span>{tr("Liên hệ", "Contacts")}</span>
              <Mail size={17} />
            </button>
          </nav>
          <Link to="/" className="adm-portal-link">
            <ExternalLink size={15} />
            {tr("Xem Web Portal", "View Web Portal")}
          </Link>
        </aside>
        <header className="adm-topbar">
          <button
            className="adm-icon muted"
            aria-label={tr("Thu gọn menu", "Toggle navigation")}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={21} />
          </button>
          <form
            className="adm-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("posts", "", search);
            }}
          >
            <button aria-label={tr("Tìm tin tức", "Search news")}>
              <Search size={17} />
            </button>
            <input
              aria-label={tr("Tìm tin tức theo tiêu đề", "Search news by title")}
              placeholder={tr("Tìm tin tức theo tiêu đề", "Search news by title")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="adm-top-actions">
            <button className="adm-user" onClick={() => navigate("profile")}>
              <span className="adm-avatar">
                <UserRound size={21} />
                <i />
              </span>
              <span>
                <b>{profileName}</b>
                <small>{tr("Quản trị nội dung", "Content editor")}</small>
              </span>
              <ChevronDown size={13} />
            </button>
            <details className="adm-language">
              <summary aria-label={tr("Chọn ngôn ngữ", "Choose language")}>
                <Globe size={18} />
              </summary>
              <div>
                {(["vi", "en"] as Locale[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      setLocale(lang);
                      e.currentTarget.closest("details")?.removeAttribute("open");
                    }}
                  >
                    {lang === "vi" ? (
                      <VietnamFlag className="adm-flag" />
                    ) : (
                      <UkFlag className="adm-flag" />
                    )}
                    {lang === "vi" ? "Tiếng Việt" : "English"}
                    {locale === lang && <Check size={13} />}
                  </button>
                ))}
              </div>
            </details>
            <button
              className="adm-icon adm-fullscreen"
              aria-label={tr("Toàn màn hình", "Fullscreen")}
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void document.documentElement.requestFullscreen().catch(() => {});
              }}
            >
              <Maximize size={16} />
            </button>
            <button
              className="adm-icon adm-mail-icon"
              aria-label={tr("Xem liên hệ", "View contacts")}
              onClick={() => navigate("contacts")}
            >
              <Mail size={20} />
              {contacts.length > 0 && <i />}
            </button>
            <button
              className="adm-icon"
              aria-label={tr("Đăng xuất", "Sign out")}
              onClick={() => setLogout(true)}
            >
              <Power size={19} />
            </button>
          </div>
        </header>
        <main className="adm-main">
          <div className="adm-demo-note">
            <AlertCircle size={15} />
            {tr(
              "Bản demo — bài viết, tệp và thao tác chỉ lưu trên trình duyệt này.",
              "Demo — articles, files and changes are saved only in this browser.",
            )}
            <Link to="/">{tr("Xem Portal", "View Portal")} ↗</Link>
          </div>
          {view === "dashboard" ? (
            <Dashboard />
          ) : view === "posts" ? (
            <ArticleList query={q} />
          ) : view === "editor" ? (
            <ArticleEditor key={id || "new"} id={id} />
          ) : view === "comments" ? (
            <div className="adm-card">
              <h1>{tr("Bình Luận - Danh Sách", "Comments - List")}</h1>
              <CommentsTable comments={comments} />
            </div>
          ) : view === "contacts" ? (
            <Contacts />
          ) : view === "profile" ? (
            <Profile onSaved={setProfileName} />
          ) : (
            <div className="adm-card">
              <h1>{tr("Đào tạo", "Training")}</h1>
              <Empty>
                {tr(
                  "Chủ đề / Khóa học / Bài học: đang để lại sau theo mục Cần làm rõ trong file BA.",
                  "Topics / Courses / Lessons are deferred, as listed in the BA document.",
                )}
              </Empty>
            </div>
          )}
        </main>
        {toast && (
          <div className="adm-toast" role="status">
            <Check size={17} />
            {toast}
          </div>
        )}
        <Dialog open={logout} onOpenChange={setLogout}>
          <DialogContent>
            <DialogTitle>{tr("Đăng xuất Admin?", "Sign out of Admin?")}</DialogTitle>
            <DialogDescription>
              {tr(
                "Dữ liệu demo đã lưu vẫn được giữ trên trình duyệt này.",
                "Saved demo data stays in this browser.",
              )}
            </DialogDescription>
            <div className="adm-modal-actions">
              <button className="adm-button secondary" onClick={() => setLogout(false)}>
                {tr("Hủy", "Cancel")}
              </button>
              <button
                className="adm-button"
                onClick={() => {
                  sessionStorage.removeItem("ncbt-admin-auth");
                  setAuthed(false);
                  setLogout(false);
                }}
              >
                {tr("Đăng xuất", "Sign out")}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Context.Provider>
  );
}
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [error, setError] = useState("");
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <img src="/branding/ncbt-logo-original.jpg" alt="NCBT" />
        <h1>{vi ? "Đăng nhập quản trị" : "Admin sign in"}</h1>
        <p>
          {vi
            ? "Bản demo trên trình duyệt — không kết nối tài khoản NBC gốc."
            : "Browser demo — not connected to NBC accounts."}
        </p>
        <form
          className="adm-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (f.get("captcha") !== "on") {
              setError(vi ? "Vui lòng xác nhận chế độ demo." : "Confirm demo mode to continue.");
              return;
            }
            if (!(await verifyDemoAdmin(String(f.get("email")), String(f.get("password"))))) {
              setError(
                vi
                  ? "Email hoặc mật khẩu Admin demo chưa đúng."
                  : "Incorrect demo Admin email or password.",
              );
              return;
            }
            onLogin();
          }}
        >
          <label className="adm-field">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@ncbt.demo"
              autoComplete="username"
            />
          </label>
          <label className="adm-field">
            {vi ? "Mật khẩu demo" : "Demo password"}
            <input
              name="password"
              type="password"
              required
              defaultValue="demo123"
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          <label className="adm-check">
            <input name="captcha" type="checkbox" required />
            {vi
              ? "Tôi đang dùng bản demo (không phải CAPTCHA thật)."
              : "I am using demo mode (not a real CAPTCHA)."}
          </label>
          {error && (
            <p role="alert" className="adm-error">
              {error}
            </p>
          )}
          <button className="adm-button" type="submit">
            SIGN IN
          </button>
        </form>
        <Link to="/">← {vi ? "Trở về Web Portal" : "Back to Web Portal"}</Link>
      </div>
    </div>
  );
}
function Dashboard() {
  const { tr, rows, navigate } = useAdmin();
  useDemoRevision();
  const [now] = useState(() => new Date());
  const month = now.toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
  });
  const published = rows.filter((a) => a.published);
  const monthly = published.filter(
    (a) =>
      new Date(a.createdAt).toLocaleDateString("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
      }) === month,
  ).length;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekly = getComments().filter(
    (c) =>
      published.some((a) => a.slug === c.slug) && c.createdAt && new Date(c.createdAt) >= monday,
  ).length;
  const contacts = getContacts();
  const events = getEvents();
  return (
    <>
      <div className="adm-dashboard-title">
        <span>
          <Home size={17} />
        </span>
        <h1>Dashboard</h1>
        <small>Overview ⓘ</small>
      </div>
      <div className="adm-stats">
        {[
          {
            label: tr("Bài viết / Tháng", "Articles / Month"),
            value: monthly,
            Icon: TrendingUp,
            go: "posts",
          },
          {
            label: tr("Bình luận / Tuần", "Comments / Week"),
            value: weekly,
            Icon: Bookmark,
            go: "comments",
          },
          {
            label: tr("Tổng Liên hệ", "Total Contacts"),
            value: contacts.length,
            Icon: Gem,
            go: "contacts",
          },
        ].map((s, i) => (
          <button
            key={s.go}
            className={`adm-stat stat-${i}`}
            onClick={() => navigate(s.go as AdminView)}
          >
            <span>{s.label}</span>
            <s.Icon size={24} />
            <strong>{s.value}</strong>
          </button>
        ))}
      </div>
      <div className="adm-card">
        <h2>{tr("Sự Kiện Mới Nhất", "Latest Events")}</h2>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>{tr("Người dùng", "User")}</th>
                <th>Status</th>
                <th>{tr("Nội dung", "Content")}</th>
                <th>{tr("Thời gian", "Time")}</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 10).map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className="adm-avatar small">
                      <UserRound size={18} />
                    </span>{" "}
                    Admin
                  </td>
                  <td>
                    <span className="adm-tag">{e.action}</span>
                  </td>
                  <td>{e.title}</td>
                  <td className="adm-nowrap">{dateTime(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!events.length && (
          <Empty>
            {tr(
              "Chưa có sự kiện. Các thao tác demo sẽ hiển thị tại đây.",
              "No events yet. Demo actions will appear here.",
            )}
          </Empty>
        )}
      </div>
    </>
  );
}
function DeleteDialog({ article, onClose }: { article: AdminArticle | null; onClose: () => void }) {
  const { tr, flash } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      open={!!article}
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>{tr("Xác nhận xóa bài viết", "Confirm article deletion")}</DialogTitle>
        <DialogDescription>
          {tr(
            "Xóa vĩnh viễn bài viết và toàn bộ bình luận liên quan. Bài không còn xuất hiện trên Portal và không thể khôi phục.",
            "Permanently delete this article and all its comments. It will no longer appear on the Portal and cannot be restored.",
          )}
        </DialogDescription>
        <p className="adm-delete-title">{article?.title}</p>
        {error && (
          <p role="alert" className="adm-error">
            {error}
          </p>
        )}
        <div className="adm-modal-actions">
          <button className="adm-button secondary" disabled={busy} onClick={onClose}>
            {tr("Hủy", "Cancel")}
          </button>
          <button
            className="adm-button danger"
            disabled={busy}
            onClick={async () => {
              if (!article) return;
              setBusy(true);
              try {
                deleteArticle(article.id);
                const keys = [
                  article.thumbnail,
                  article.video || "",
                  ...(article.content.match(/demo-media:[a-f0-9-]+/g) || []),
                ];
                await discardUnusedMedia(keys, JSON.stringify(getAdminArticles())).catch(() => {});
                flash(
                  tr(
                    "Đã xóa bài viết và bình luận liên quan.",
                    "Article and associated comments deleted.",
                  ),
                );
                onClose();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? tr("Đang xóa…", "Deleting…") : tr("Xóa bài", "Delete article")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function ArticleList({ query }: { query: string }) {
  const { tr, rows, navigate, flash } = useAdmin();
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<AdminArticle | null>(null);
  useEffect(() => setPage(1), [query, category, status]);
  const filtered = rows
    .filter(
      (a) =>
        (!query || norm(a.title).includes(norm(query))) &&
        (!category || a.category === category) &&
        (status === "all" || a.published === (status === "yes")),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const current = Math.min(page, pages);
  function toggle(a: AdminArticle, key: "published" | "featured") {
    try {
      toggleArticle(a.id, key);
      flash(tr("Đã cập nhật trạng thái bài viết.", "Article status updated."));
    } catch (e) {
      flash((e as Error).message);
    }
  }
  return (
    <div className="adm-card">
      <div className="adm-card-heading">
        <h1>{tr("Tin Tức - Danh Sách", "News - List")}</h1>
        <button className="adm-button" onClick={() => navigate("editor")}>
          <Plus size={15} />
          {tr("Thêm mới", "Add new")}
        </button>
      </div>
      <div className="adm-filters">
        <select
          aria-label={tr("Lọc thể loại", "Filter category")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{tr("Tất cả thể loại", "All categories")}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          aria-label={tr("Lọc công bố", "Filter publication")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">{tr("Tất cả trạng thái", "All states")}</option>
          <option value="yes">{tr("Đã công bố", "Published")}</option>
          <option value="no">{tr("Đang ẩn", "Hidden")}</option>
        </select>
        <span>
          {filtered.length} {tr("bài viết", "articles")}
          {query && <> · “{query}”</>}
        </span>
        {query && (
          <button className="adm-text-button" onClick={() => navigate("posts")}>
            {tr("Xóa tìm kiếm", "Clear search")}
          </button>
        )}
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table adm-news-table">
          <thead>
            <tr>
              {[
                "ID",
                tr("Tiêu đề", "Title"),
                tr("Tóm tắt", "Summary"),
                tr("Thể loại", "Category"),
                tr("Lượt Xem", "Views"),
                tr("Nổi bật", "Featured"),
                tr("Công bố", "Published"),
                tr("Xóa", "Delete"),
                tr("Sửa", "Edit"),
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((current - 1) * 10, current * 10).map((a) => (
              <tr key={a.id}>
                <td>{a.id.startsWith("nbc-") ? a.id.slice(4) : a.id.slice(-5).toUpperCase()}</td>
                <td>
                  <button className="adm-article-title" onClick={() => navigate("editor", a.id)}>
                    {a.title}
                  </button>
                  <MediaImage src={a.thumbnail} alt="" className="adm-table-image" />
                  <small>{a.date.split("-").reverse().join("/")}</small>
                </td>
                <td>
                  <span className="adm-summary-clamp">{a.summary}</span>
                </td>
                <td>
                  <span className="adm-tag">
                    {a.kind === "video" ? tr("Tin Video", "Video") : tr("Tin Ảnh", "Image")}
                  </span>
                  <p>{categoryName(a.category)}</p>
                </td>
                <td className="adm-number">{a.views}</td>
                <td>
                  <button
                    className={`adm-row-action ${a.featured ? "on" : ""}`}
                    aria-label={
                      tr(
                        a.featured ? "Bỏ nổi bật: " : "Đánh dấu nổi bật: ",
                        a.featured ? "Unfeature: " : "Feature: ",
                      ) + a.title
                    }
                    aria-pressed={a.featured}
                    onClick={() => toggle(a, "featured")}
                  >
                    <Star size={17} fill={a.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td>
                  <button
                    className={`adm-row-action ${a.published ? "on" : ""}`}
                    aria-label={
                      tr(
                        a.published ? "Ẩn bài: " : "Công bố bài: ",
                        a.published ? "Hide: " : "Publish: ",
                      ) + a.title
                    }
                    aria-pressed={a.published}
                    onClick={() => toggle(a, "published")}
                  >
                    {a.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </td>
                <td>
                  <button
                    className="adm-row-action delete"
                    aria-label={tr("Xóa bài: ", "Delete: ") + a.title}
                    onClick={() => setDeleting(a)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
                <td>
                  <button
                    className="adm-row-action"
                    aria-label={tr("Sửa bài: ", "Edit: ") + a.title}
                    onClick={() => navigate("editor", a.id)}
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <Empty>{tr("Không tìm thấy bài viết phù hợp.", "No matching articles found.")}</Empty>
      )}
      <div className="adm-pagination">
        <span>
          {tr("Trang", "Page")} {current} / {pages}
        </span>
        <button disabled={current === 1} onClick={() => setPage(current - 1)}>
          ‹
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === pages || Math.abs(n - current) < 2)
          .map((n, i, arr) => (
            <span key={n}>
              {i > 0 && n - arr[i - 1]! > 1 && "…"}
              <button aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>
                {n}
              </button>
            </span>
          ))}
        <button disabled={current === pages} onClick={() => setPage(current + 1)}>
          ›
        </button>
      </div>
      <DeleteDialog article={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}
function ArticleEditor({ id }: { id: string }) {
  const { vi, tr, rows, navigate, flash } = useAdmin();
  const original = rows.find((a) => a.id === id);
  const [initial] = useState<AdminArticle>(() =>
    original
      ? { ...original }
      : {
          id: "demo-" + crypto.randomUUID(),
          title: "",
          slug: "",
          date: "",
          category: "",
          thumbnail: "",
          summary: "",
          content: "",
          kind: "image",
          video: "",
          published: false,
          featured: false,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
  );
  const [form, setForm] = useState({ ...initial });
  const [resetKey, setResetKey] = useState(0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const update = <K extends keyof AdminArticle>(key: K, value: AdminArticle[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  async function upload(file: File, field: "thumbnail" | "video") {
    setError("");
    if (
      (field === "thumbnail" &&
        (!file.type.startsWith("image/") || file.type === "image/svg+xml")) ||
      (field === "video" && !file.type.startsWith("video/"))
    ) {
      setError(
        tr("Tệp không đúng loại đã chọn.", "The file does not match the selected media type."),
      );
      return;
    }
    setUploading(field);
    try {
      update(field, await saveDemoMedia(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading("");
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const content = sanitizeEditorHtml(form.content);
    if (!content.replace(/<[^>]*>/g, "").trim() && !/<(img|video)\b/i.test(content)) {
      setError(tr("Vui lòng nhập nội dung bài viết.", "Enter article content."));
      return;
    }
    if (form.kind === "image" && !form.thumbnail) {
      setError(tr("Vui lòng chọn ảnh cho bài viết.", "Choose an image for this article."));
      return;
    }
    if (form.kind === "video" && !form.video) {
      setError(tr("Vui lòng chọn tệp video.", "Choose a video file."));
      return;
    }
    if (form.thumbnail && !/^(https?:\/\/|\/nbc\/|\/images\/|demo-media:)/i.test(form.thumbnail)) {
      setError(tr("Đường dẫn ảnh không hợp lệ.", "Invalid image URL."));
      return;
    }
    try {
      const saved = saveArticle({
        ...form,
        content,
        thumbnail: form.thumbnail || "/images/news-placeholder.svg",
      });
      flash(
        saved.published
          ? tr("Đã lưu và công bố bài lên Portal.", "Article saved and published on the Portal.")
          : tr("Đã lưu bài đang ẩn trong Admin.", "Article saved as hidden in Admin."),
      );
      navigate("posts");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (id && !original)
    return (
      <div className="adm-card">
        <h1>{tr("Không tìm thấy bài viết", "Article not found")}</h1>
        <button className="adm-button" onClick={() => navigate("posts")}>
          {tr("Về danh sách", "Back to list")}
        </button>
      </div>
    );
  return (
    <div className="adm-card">
      <div className="adm-card-heading">
        <h1>{tr(id ? "Tin Tức - Sửa" : "Tin Tức - Thêm", id ? "News - Edit" : "News - Add")}</h1>
        <div className="adm-heading-actions">
          {original?.published && (
            <Link
              to="/tin-tuc/$slug"
              params={{ slug: original.slug }}
              className="adm-text-button"
              target="_blank"
            >
              {tr("Xem trên Portal", "View on Portal")} ↗
            </Link>
          )}
          <button
            className="adm-text-button"
            onClick={() => (dirty ? setCancelOpen(true) : navigate("posts"))}
          >
            <ArrowLeft size={15} />
            {tr("Danh sách", "List")}
          </button>
        </div>
      </div>
      <form className="adm-form" onSubmit={submit}>
        <label className="adm-field">
          {tr("1) Thể Loại *", "1) Category *")}
          <select
            value={form.category}
            required
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">--</option>
            {categoryGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    .. {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="adm-field">
          {tr("2.1) Tiêu Đề *", "2.1) Title *")}
          <input
            value={form.title}
            placeholder={tr("Nhập tiêu đề", "Enter title")}
            required
            maxLength={300}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: !id && (!f.slug || f.slug === toSlug(f.title)) ? toSlug(title) : f.slug,
              }));
            }}
          />
        </label>
        <label className="adm-field">
          {tr("2.2) Ngày đăng *", "2.2) Publish date *")}
          <input
            type="date"
            value={form.date}
            required
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label className="adm-field">
          {tr("3) Tóm tắt *", "3) Summary *")}
          <textarea
            rows={5}
            value={form.summary}
            required
            maxLength={5000}
            onChange={(e) => update("summary", e.target.value)}
          />
        </label>
        <div className="adm-field">
          <label>{tr("4) Nội dung *", "4) Content *")}</label>
          <RichEditor
            initial={initial.content}
            resetKey={resetKey}
            vi={vi}
            onChange={(html) => update("content", html)}
          />
        </div>
        <label className="adm-field">
          {tr("5) Loại Tin *", "5) Media type *")}
          <select
            value={form.kind}
            onChange={(e) => update("kind", e.target.value as "image" | "video")}
          >
            <option value="image">{tr("Hình ảnh", "Image")}</option>
            <option value="video">Video</option>
          </select>
        </label>
        <div className="adm-field">
          <label htmlFor="adm-thumbnail">
            {tr(
              form.kind === "image" ? "6) Hình ảnh *" : "6) Ảnh đại diện",
              form.kind === "image" ? "6) Image *" : "6) Cover image",
            )}
          </label>
          <input
            key={"image-" + resetKey}
            id="adm-thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f, "thumbnail");
            }}
          />
          {uploading === "thumbnail" && (
            <progress aria-label={tr("Đang tải ảnh", "Uploading image")} />
          )}
          <label className="adm-image-url">
            {tr("Hoặc đường dẫn ảnh", "Or image URL")}
            <input
              type="text"
              value={form.thumbnail.startsWith("demo-media:") ? "" : form.thumbnail}
              placeholder="https://…"
              onChange={(e) => update("thumbnail", e.target.value)}
            />
          </label>
          {form.thumbnail && (
            <MediaImage
              src={form.thumbnail}
              alt={tr("Ảnh bài viết hiện tại", "Current article cover")}
              className="adm-cover-preview"
            />
          )}
        </div>
        {form.kind === "video" && (
          <div className="adm-field">
            <label htmlFor="adm-video">{tr("7) Tệp Video *", "7) Video file *")}</label>
            <input
              key={"video-" + resetKey}
              id="adm-video"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f, "video");
              }}
            />
            {uploading === "video" && (
              <progress aria-label={tr("Đang tải video", "Uploading video")} />
            )}{" "}
            {form.video && <MediaVideo src={form.video} />}
          </div>
        )}
        <div className="adm-form-pair">
          <label className="adm-field">
            {tr("Nổi bật", "Featured")}
            <select
              value={form.featured ? "yes" : "no"}
              onChange={(e) => update("featured", e.target.value === "yes")}
            >
              <option value="no">{tr("Không", "No")}</option>
              <option value="yes">{tr("Có", "Yes")}</option>
            </select>
          </label>
          <label className="adm-field">
            {tr("Công bố", "Published")}
            <select
              value={form.published ? "yes" : "no"}
              onChange={(e) => update("published", e.target.value === "yes")}
            >
              <option value="no">{tr("Không", "No")}</option>
              <option value="yes">{tr("Có", "Yes")}</option>
            </select>
          </label>
        </div>
        <p className="adm-form-note">
          {form.published
            ? tr(
                "Bài được công bố sẽ hiển thị đúng chuyên mục trên Portal.",
                "Published articles appear in their selected Portal category.",
              )
            : tr(
                "Bài đang ẩn chỉ có trong Admin; Portal và link chi tiết không hiển thị.",
                "Hidden articles remain in Admin and are inaccessible on the Portal.",
              )}
        </p>
        <label className="adm-field">
          {tr("Đường dẫn bài viết", "Article URL slug")}
          <input
            value={form.slug}
            required
            maxLength={180}
            onChange={(e) => update("slug", toSlug(e.target.value))}
          />
        </label>
        {id && (
          <p className="adm-form-note">
            {tr("Ngày tạo", "Created")}: {dateTime(initial.createdAt)}
          </p>
        )}
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
        <div className="adm-form-actions">
          <button className="adm-button" disabled={!!uploading}>
            {tr(id ? "Sửa" : "Thêm", id ? "Save changes" : "Add")}
          </button>
          <button
            type="button"
            className="adm-button secondary"
            onClick={() => {
              setForm({ ...initial });
              setError("");
              setResetKey((k) => k + 1);
            }}
          >
            {tr("làm mới", "Reset")}
          </button>
        </div>
      </form>
      {id && (
        <>
          <h2 className="adm-comments-heading">{tr("Bình Luận", "Comments")}</h2>
          <CommentsTable comments={getComments().filter((c) => c.slug === original?.slug)} />
        </>
      )}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogTitle>{tr("Bỏ thay đổi chưa lưu?", "Discard unsaved changes?")}</DialogTitle>
          <DialogDescription>
            {tr(
              "Những nội dung bạn vừa chỉnh sửa chưa được lưu.",
              "Your latest changes have not been saved.",
            )}
          </DialogDescription>
          <div className="adm-modal-actions">
            <button className="adm-button secondary" onClick={() => setCancelOpen(false)}>
              {tr("Tiếp tục sửa", "Keep editing")}
            </button>
            <button className="adm-button danger" onClick={() => navigate("posts")}>
              {tr("Bỏ thay đổi", "Discard changes")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function CommentsTable({ comments }: { comments: DemoComment[] }) {
  const { tr, flash } = useAdmin();
  const [deleting, setDeleting] = useState<DemoComment | null>(null);
  return (
    <>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{tr("Tên", "Name")}</th>
              <th>{tr("Bài viết", "Article")}</th>
              <th>{tr("Nội dung", "Content")}</th>
              <th>{tr("Ngày gửi", "Sent at")}</th>
              <th>{tr("Xóa", "Delete")}</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.slug + c.index}>
                <td>{c.name}</td>
                <td>{c.articleTitle}</td>
                <td>{c.text}</td>
                <td>{c.createdAt ? dateTime(c.createdAt) : "—"}</td>
                <td>
                  <button
                    className="adm-row-action delete"
                    aria-label={tr("Xóa bình luận", "Delete comment")}
                    onClick={() => setDeleting(c)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!comments.length && <Empty>{tr("Chưa có bình luận.", "No comments yet.")}</Empty>}
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{tr("Xóa bình luận?", "Delete comment?")}</DialogTitle>
          <DialogDescription>
            {tr(
              "Bình luận sẽ bị xóa khỏi Admin và Portal.",
              "The comment will be removed from Admin and the Portal.",
            )}
          </DialogDescription>
          <p>{deleting?.text}</p>
          <div className="adm-modal-actions">
            <button className="adm-button secondary" onClick={() => setDeleting(null)}>
              {tr("Hủy", "Cancel")}
            </button>
            <button
              className="adm-button danger"
              onClick={() => {
                if (deleting) {
                  removeComment(deleting.slug, deleting.index);
                  setDeleting(null);
                  flash(tr("Đã xóa bình luận.", "Comment deleted."));
                }
              }}
            >
              {tr("Xóa", "Delete")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
function Contacts() {
  const { tr } = useAdmin();
  useDemoRevision();
  const rows = getContacts();
  const [selected, setSelected] = useState<DemoContact | null>(null);
  const purpose = (s: string) =>
    ({
      support: tr("Liên hệ hỗ trợ", "Support"),
      cooperation: tr("Liên hệ cộng tác", "Cooperation"),
      complaint: tr("Thắc mắc, khiếu nại", "Questions, complaints"),
    })[s] ?? s;
  return (
    <div className="adm-card">
      <h1>{tr("Liên Hệ - Danh Sách", "Contacts - List")}</h1>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              {[
                tr("Tên", "Name"),
                "Email",
                tr("Mục đích", "Purpose"),
                tr("Nội dung", "Message"),
                tr("Thời gian", "Time"),
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={i}>
                <td>
                  <button className="adm-text-button" onClick={() => setSelected(c)}>
                    {c.name}
                  </button>
                </td>
                <td>{c.email}</td>
                <td>{purpose(c.purpose)}</td>
                <td>
                  <button
                    className="adm-text-button adm-contact-preview"
                    onClick={() => setSelected(c)}
                  >
                    {c.message}
                  </button>
                </td>
                <td className="adm-nowrap">{dateTime(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && (
        <Empty>
          {tr(
            "Chưa có liên hệ. Liên hệ gửi từ Portal sẽ hiển thị tại đây.",
            "No contacts yet. Messages submitted on the Portal will appear here.",
          )}
        </Empty>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{tr("Chi tiết liên hệ", "Contact details")}</DialogTitle>
          <DialogDescription>
            {selected?.name} · {selected?.email}
          </DialogDescription>
          <p>{purpose(selected?.purpose || "")}</p>
          <p className="adm-contact-message">{selected?.message}</p>
          <small>{dateTime(selected?.createdAt || "")}</small>
          <div className="adm-modal-actions">
            <button className="adm-button secondary" onClick={() => setSelected(null)}>
              {tr("Đóng", "Close")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Profile({ onSaved }: { onSaved: (name: string) => void }) {
  const { tr, flash } = useAdmin();
  const [initial, setInitial] = useState(() => {
    try {
      return {
        name: "Admin NCBT",
        email: "admin@ncbt.demo",
        ...JSON.parse(localStorage.getItem("ncbt-admin-profile") || "{}"),
      };
    } catch {
      return { name: "Admin NCBT", email: "admin@ncbt.demo" };
    }
  });
  const [name, setName] = useState(initial.name);
  const [changing, setChanging] = useState(false);
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="adm-card">
      <h1>{tr("Thông Tin Tài Khoản", "Account Information")}</h1>
      <form
        className="adm-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (changing && (password.length < 6 || password !== repeat)) {
            setError(
              tr(
                "Mật khẩu cần ít nhất 6 ký tự và hai lần nhập phải giống nhau.",
                "Passwords must match and contain at least 6 characters.",
              ),
            );
            return;
          }
          if (changing) await setDemoPassword(password);
          localStorage.setItem(
            "ncbt-admin-profile",
            JSON.stringify({ name: name.trim(), email: initial.email }),
          );
          onSaved(name.trim());
          setInitial({ ...initial, name: name.trim() });
          setError("");
          setPassword("");
          setRepeat("");
          setChanging(false);
          notifyDemo();
          flash(tr("Đã lưu thông tin tài khoản demo.", "Demo account information saved."));
        }}
      >
        <label className="adm-field">
          {tr("Tên", "Name")}
          <input value={name} required onChange={(e) => setName(e.target.value)} maxLength={100} />
        </label>
        <label className="adm-field">
          Email
          <input value={initial.email} disabled />
        </label>
        <label className="adm-check">
          <input
            type="checkbox"
            checked={changing}
            onChange={(e) => setChanging(e.target.checked)}
          />
          {tr("Đổi mật khẩu", "Change password")}
        </label>
        <input
          aria-label={tr("Mật khẩu mới", "New password")}
          type="password"
          disabled={!changing}
          placeholder={tr("Nhập mật khẩu", "Enter password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="adm-field">
          {tr("Nhập lại Password", "Confirm password")}
          <input
            type="password"
            disabled={!changing}
            placeholder={tr("Nhập mật khẩu", "Enter password")}
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          />
        </label>
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
        <div className="adm-form-actions">
          <button className="adm-button">{tr("Sửa", "Save")}</button>
          <button
            type="button"
            className="adm-button secondary"
            onClick={() => {
              setName(initial.name);
              setChanging(false);
              setPassword("");
              setRepeat("");
              setError("");
            }}
          >
            {tr("làm mới", "Reset")}
          </button>
        </div>
        <p className="adm-form-note">
          {tr(
            "Mật khẩu chỉ được kiểm tra trong bản demo; không thay đổi tài khoản NBC thật.",
            "Password validation is for this demo only; it does not change any real NBC account.",
          )}
        </p>
      </form>
    </div>
  );
}

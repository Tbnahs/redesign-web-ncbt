import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Image,
  Table,
  Code,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { resolveDemoMedia, saveDemoMedia } from "@/lib/demo-media";
export function RichEditor({
  initial,
  resetKey,
  onChange,
  vi,
}: {
  initial: string;
  resetKey: number;
  onChange: (html: string) => void;
  vi: boolean;
}) {
  const editor = useRef<HTMLDivElement>(null);
  const imageFile = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState(initial);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("https://");
  const [error, setError] = useState("");
  useEffect(() => {
    if (editor.current) editor.current.innerHTML = initial;
    editor.current?.querySelectorAll('img[src^="demo-media:"]').forEach((el) => {
      const key = el.getAttribute("src")!;
      el.setAttribute("data-ncbt-media", key);
      void resolveDemoMedia(key).then((url) => {
        if (editor.current?.contains(el)) el.setAttribute("src", url);
      });
    });
    setSource(initial);
    setSourceMode(false);
  }, [resetKey]);
  function serialize() {
    if (!editor.current) return "";
    const clone = editor.current.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-ncbt-media]").forEach((el) => {
      el.setAttribute("src", el.getAttribute("data-ncbt-media")!);
      el.removeAttribute("data-ncbt-media");
    });
    return clone.innerHTML;
  }
  function changed() {
    const value = serialize();
    setSource(value);
    onChange(value);
  }
  function command(name: string, value?: string) {
    editor.current?.focus();
    document.execCommand(name, false, value);
    changed();
  }
  async function insertImage(file: File) {
    try {
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml")
        throw Error(
          vi ? "Chọn tệp JPG, PNG, GIF hoặc WebP." : "Choose a JPG, PNG, GIF or WebP image.",
        );
      const key = await saveDemoMedia(file);
      const src = await resolveDemoMedia(key);
      editor.current?.focus();
      if (savedSelection.current) {
        const s = getSelection();
        s?.removeAllRanges();
        s?.addRange(savedSelection.current);
      }
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${src}" data-ncbt-media="${key}" alt=""/><p><br></p>`,
      );
      changed();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const tools = [
    { Icon: Bold, label: vi ? "In đậm" : "Bold", cmd: "bold" },
    { Icon: Italic, label: vi ? "In nghiêng" : "Italic", cmd: "italic" },
    { Icon: Underline, label: vi ? "Gạch chân" : "Underline", cmd: "underline" },
    { Icon: List, label: vi ? "Danh sách" : "Bullet list", cmd: "insertUnorderedList" },
    { Icon: ListOrdered, label: vi ? "Đánh số" : "Numbered list", cmd: "insertOrderedList" },
    { Icon: AlignLeft, label: vi ? "Căn trái" : "Align left", cmd: "justifyLeft" },
    { Icon: AlignCenter, label: vi ? "Căn giữa" : "Align center", cmd: "justifyCenter" },
    { Icon: AlignRight, label: vi ? "Căn phải" : "Align right", cmd: "justifyRight" },
  ];
  return (
    <div className="adm-rich">
      <div className="adm-rich-toolbar">
        <button
          type="button"
          onClick={() => {
            if (sourceMode) {
              if (editor.current) editor.current.innerHTML = source;
              onChange(source);
            } else setSource(serialize());
            setSourceMode(!sourceMode);
          }}
        >
          <Code size={15} /> Source
        </button>
        <span className="adm-toolbar-separator" />
        {[
          { Icon: Undo2, cmd: "undo", label: "Undo" },
          { Icon: Redo2, cmd: "redo", label: "Redo" },
          ...tools,
        ].map(({ Icon, cmd, label }) => (
          <button
            key={cmd}
            type="button"
            title={label}
            aria-label={label}
            disabled={sourceMode}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => command(cmd)}
          >
            <Icon size={15} />
          </button>
        ))}
        <button
          type="button"
          title={vi ? "Chèn liên kết" : "Insert link"}
          aria-label={vi ? "Chèn liên kết" : "Insert link"}
          disabled={sourceMode}
          onMouseDown={(e) => {
            e.preventDefault();
            const s = getSelection();
            if (s?.rangeCount) savedSelection.current = s.getRangeAt(0).cloneRange();
          }}
          onClick={() => {
            setUrl("https://");
            setLinkOpen(true);
          }}
        >
          <Link2 size={15} />
        </button>
        <button
          type="button"
          title={vi ? "Chèn ảnh" : "Insert image"}
          aria-label={vi ? "Chèn ảnh" : "Insert image"}
          disabled={sourceMode}
          onMouseDown={(e) => {
            e.preventDefault();
            const s = getSelection();
            if (s?.rangeCount) savedSelection.current = s.getRangeAt(0).cloneRange();
          }}
          onClick={() => imageFile.current?.click()}
        >
          <Image size={15} />
        </button>
        <button
          type="button"
          title={vi ? "Chèn bảng 2 × 3" : "Insert 2 × 3 table"}
          aria-label={vi ? "Chèn bảng" : "Insert table"}
          disabled={sourceMode}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            command(
              "insertHTML",
              "<table><tbody><tr><td> </td><td> </td><td> </td></tr><tr><td> </td><td> </td><td> </td></tr></tbody></table><p><br></p>",
            )
          }
        >
          <Table size={15} />
        </button>
        <button
          type="button"
          title={vi ? "Xóa định dạng" : "Remove formatting"}
          aria-label={vi ? "Xóa định dạng" : "Remove formatting"}
          disabled={sourceMode}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("removeFormat")}
        >
          <RemoveFormatting size={15} />
        </button>
        <div className="adm-rich-selects">
          <select
            aria-label={vi ? "Định dạng" : "Format"}
            defaultValue="p"
            disabled={sourceMode}
            onChange={(e) => command("formatBlock", e.target.value)}
          >
            <option value="p">Format</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Normal</option>
            <option value="blockquote">Quote</option>
          </select>
          <select
            aria-label="Font"
            defaultValue="Roboto"
            disabled={sourceMode}
            onChange={(e) => command("fontName", e.target.value)}
          >
            <option>Roboto</option>
            <option>Arial</option>
            <option>Times New Roman</option>
          </select>
          <select
            aria-label={vi ? "Cỡ chữ" : "Font size"}
            defaultValue="3"
            disabled={sourceMode}
            onChange={(e) => command("fontSize", e.target.value)}
          >
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">Larger</option>
          </select>
        </div>
      </div>
      <textarea
        className="adm-source-input"
        aria-label="HTML Source"
        hidden={!sourceMode}
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
          onChange(e.target.value);
        }}
      />
      <div
        ref={editor}
        role="textbox"
        aria-label={vi ? "Nội dung bài viết" : "Article content"}
        aria-multiline="true"
        contentEditable={!sourceMode}
        suppressContentEditableWarning
        hidden={sourceMode}
        className="adm-rich-content"
        onInput={changed}
      />
      <div className="adm-rich-status">{vi ? "Nội dung bài viết" : "Article content"}</div>
      <input
        ref={imageFile}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent>
          <DialogTitle>{vi ? "Chèn liên kết" : "Insert link"}</DialogTitle>
          <DialogDescription>
            {vi ? "Nhập đường dẫn cho đoạn chữ đang chọn." : "Enter a URL for the selected text."}
          </DialogDescription>
          <label className="adm-field">
            URL
            <input value={url} onChange={(e) => setUrl(e.target.value)} autoFocus />
          </label>
          <div className="adm-modal-actions">
            <button
              type="button"
              className="adm-button secondary"
              onClick={() => setLinkOpen(false)}
            >
              {vi ? "Hủy" : "Cancel"}
            </button>
            <button
              type="button"
              className="adm-button"
              disabled={!/^https?:\/\//i.test(url)}
              onClick={() => {
                setLinkOpen(false);
                setTimeout(() => {
                  editor.current?.focus();
                  if (savedSelection.current) {
                    const s = getSelection();
                    s?.removeAllRanges();
                    s?.addRange(savedSelection.current);
                  }
                  command("createLink", url);
                }, 50);
              }}
            >
              {vi ? "Chèn liên kết" : "Insert link"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

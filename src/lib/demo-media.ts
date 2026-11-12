import { useEffect, useState } from "react";
const urls = new Map<string, string>();
function openMedia() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open("ncbt-demo-media", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(Error("Trình duyệt chưa cho phép lưu tệp. Vui lòng thử lại hoặc nhập đường dẫn ảnh."));
  });
}
export async function saveDemoMedia(file: File) {
  const db = await openMedia();
  const id = crypto.randomUUID();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(Error("Không lưu được tệp. Vui lòng thử lại."));
  });
  db.close();
  const key = "demo-media:" + id;
  urls.set(key, URL.createObjectURL(file));
  return key;
}
export async function resolveDemoMedia(key: string) {
  if (!key.startsWith("demo-media:")) return key;
  if (urls.has(key)) return urls.get(key)!;
  const db = await openMedia();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const req = db.transaction("files").objectStore("files").get(key.slice(11));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  db.close();
  if (!blob) return "/images/news-placeholder.svg";
  const url = URL.createObjectURL(blob);
  urls.set(key, url);
  return url;
}
export async function discardUnusedMedia(keys: string[], remaining: string) {
  const db = await openMedia();
  const tx = db.transaction("files", "readwrite");
  for (const key of keys) {
    if (key.startsWith("demo-media:") && !remaining.includes(key)) {
      tx.objectStore("files").delete(key.slice(11));
      const url = urls.get(key);
      if (url) URL.revokeObjectURL(url);
      urls.delete(key);
    }
  }
  db.close();
}
export function useDemoMediaUrl(key: string, fallback = "/images/news-placeholder.svg") {
  const [value, setValue] = useState(
    key.startsWith("demo-media:") ? (urls.get(key) ?? fallback) : key,
  );
  useEffect(() => {
    let live = true;
    setValue(key.startsWith("demo-media:") ? (urls.get(key) ?? fallback) : key);
    if (key.startsWith("demo-media:"))
      resolveDemoMedia(key)
        .then((url) => {
          if (live) setValue(url);
        })
        .catch(() => {});
    return () => {
      live = false;
    };
  }, [key, fallback]);
  return value;
}
export function sanitizeEditorHtml(html: string) {
  if (typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc
    .querySelectorAll(
      "script,style,iframe,object,embed,form,input,button,textarea,select,link,meta,base",
    )
    .forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith("on") || ["srcdoc", "id", "class"].includes(attr.name))
        el.removeAttribute(attr.name);
      if (
        ["href", "src"].includes(attr.name) &&
        !/^(https?:|mailto:|tel:|\/|#|demo-media:|blob:)/i.test(attr.value)
      )
        el.removeAttribute(attr.name);
      if (attr.name === "style") {
        const safe = attr.value
          .split(";")
          .filter(
            (s) =>
              /^(text-align|font-size|font-family|color|background-color|font-weight|font-style|text-decoration)\s*:/i.test(
                s.trim(),
              ) && !/url\(|expression|javascript/i.test(s),
          )
          .join(";");
        el.setAttribute("style", safe);
      }
    }
    if (el.tagName === "A") {
      el.setAttribute("rel", "noopener noreferrer");
      el.setAttribute("target", "_blank");
    }
  });
  return doc.body.innerHTML;
}
export function useDemoHtml(html: string) {
  const [resolved, setResolved] = useState(html);
  useEffect(() => {
    let live = true;
    setResolved(html);
    if (!html.includes("demo-media:"))
      return () => {
        live = false;
      };
    const doc = new DOMParser().parseFromString(html, "text/html");
    Promise.all(
      [...doc.querySelectorAll("img,video,source")].map(async (el) => {
        const key = el.getAttribute("src") || "";
        if (key.startsWith("demo-media:")) el.setAttribute("src", await resolveDemoMedia(key));
      }),
    )
      .then(() => {
        if (live) setResolved(doc.body.innerHTML);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [html]);
  return resolved;
}

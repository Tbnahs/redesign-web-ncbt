export interface SitePageMeta {
  title: string;
  description: string;
  image?: string;
}

export function siteHead({ title, description, image }: SitePageMeta) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(image
        ? [
            { property: "og:image", content: image },
            { name: "twitter:image", content: image },
          ]
        : []),
    ],
  };
}

export function homeHead() {
  return siteHead({
    title: "Trung tâm Mã số, Mã vạch Quốc gia | Cổng thông tin",
    description:
      "Tin tức, hoạt động, giải đáp và thông tin đào tạo của Trung tâm Mã số, Mã vạch Quốc gia.",
    image:
      "https://images.pexels.com/photos/12935049/pexels-photo-12935049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  });
}

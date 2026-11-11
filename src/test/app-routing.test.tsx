import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { mediaUrl } from "@/data/media";
import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("uses a local fallback image when a source media URL is missing", () => {
    expect(mediaUrl("/__l5e/assets-v1/not-found/placeholder.jpg")).toBe("/images/news-placeholder.svg");
  });

  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches all migrated site pages and news article URLs", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const paths = [
      "/tin-tuc",
      "/tin-tuc/tin-tuc-su-kien",
      "/tin-tuc/hoi-nghis-trien-khai-chien-luoc-msmv",
      "/hoat-dong-msmv-dia-phuong",
      "/gioi-thieu/lich-su-hinh-thanh",
      "/gioi-thieu/chuc-nang-nhiem-vu",
      "/gioi-thieu/co-cau-to-chuc",
      "/gioi-thieu/doi-tac-quoc-te",
      "/hoat-dong/ma-so-ma-vach",
      "/hoat-dong/truy-xuat-nguon-goc",
      "/hoat-dong/ma-lei",
      "/hoat-dong/ma-udi",
      "/hoat-dong/dao-tao",
      "/hoat-dong-msmv-dia-phuong",
      "/truy-xuat-nguon-goc",
      "/truy-xuat-nguon-goc/dang-ky-chuoi",
      "/truy-xuat-nguon-goc/tra-cuu-san-pham",
      "/hoi-dap",
      "/hoi-dap/cau-hoi-thuong-gap",
      "/hoi-dap/danh-sach-cau-hoi",
      "/hoi-dap/tao-cau-hoi",
      "/lien-he",
      "/e-learning",
    ];

    for (const path of paths) {
      expect(router.matchRoutes(path).at(-1)?.routeId, path).not.toBe(rootRouteId);
    }
  });
});

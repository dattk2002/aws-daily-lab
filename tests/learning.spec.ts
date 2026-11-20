import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("learn, answer, complete and reload without losing progress or notes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await page.getByRole("link", { name: "Bắt đầu ngày đầu tiên" }).click();
  await expect(
    page.getByRole("heading", { name: "Tự kiểm tra" }),
  ).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Kiểm tra đáp án" }).click();
  await expect(page.getByTestId("quiz-feedback")).toBeVisible();
  await page
    .getByLabel("Ghi chú của bạn")
    .fill("Mình đã hiểu request đi qua các lớp.");
  await page
    .getByRole("button", { name: "Đánh dấu hoàn thành", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("Ghi chú của bạn")).toHaveValue(
    "Mình đã hiểu request đi qua các lớp.",
  );
  await expect(
    page.getByRole("button", { name: "Đã hoàn thành", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("quiz-feedback")).toBeVisible();
  expect(errors).toEqual([]);
});

test("search handles accents, empty results and clearing filters", async ({
  page,
}) => {
  await page.goto("./#/roadmap");
  await page.getByRole("searchbox").fill("zz-no-such-aws-service");
  await expect(page.getByText("Chưa tìm thấy bài phù hợp")).toBeVisible();
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await page.getByRole("searchbox").fill("canh bao");
  await expect(page.locator(".roadmap-day")).toHaveCount(1);
});

test("rejects corrupted import and supports export/import round trip", async ({
  page,
}) => {
  await page.goto("./#/lesson/01-1");
  await page
    .getByRole("button", { name: "Đánh dấu hoàn thành", exact: true })
    .click();
  await page.goto("./#/settings");
  await page
    .getByLabel("Nhập tệp tiến độ")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":77}'),
    });
  await expect(page.getByRole("alert")).toContainText("không hợp lệ");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Xuất tiến độ" }).click();
  const download = await downloadEvent;
  const file = await download.path();
  expect(file).toBeTruthy();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Xóa toàn bộ tiến độ" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Nhập tệp tiến độ").setInputFiles(file!);
  await page.goto("./#/lesson/01-1");
  await expect(
    page.getByRole("button", { name: "Đã hoàn thành", exact: true }),
  ).toBeVisible();
});

test("corrupt saved data is recoverable and unknown routes do not show a blank screen", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("aws-daily-lab:progress:v1", "{bad"),
  );
  await page.goto("./#/lesson/99-9");
  await expect(
    page.getByRole("heading", { name: "Không tìm thấy trang này" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("dữ liệu");
});

test("unavailable storage keeps learning usable and offers a backup", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.goto("./#/lesson/01-1");
  await page
    .getByRole("button", { name: "Đánh dấu hoàn thành", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Đã hoàn thành", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("xuất bản sao");
});

test("an invalid start date never overwrites otherwise valid learning progress", async ({
  page,
}) => {
  await page.goto("./#/lesson/01-1");
  await page
    .getByRole("button", { name: "Đánh dấu hoàn thành", exact: true })
    .click();
  await page.goto("./#/settings");
  await page.getByLabel("Ngày bắt đầu", { exact: true }).fill("10000-01-01");
  await expect(page.getByRole("alert")).toContainText("Ngày");
  await page.reload();
  await page.goto("./#/lesson/01-1");
  await expect(
    page.getByRole("button", { name: "Đã hoàn thành", exact: true }),
  ).toBeVisible();
});

for (const width of [375, 768, 1440]) {
  test(`layout is contained at ${width}px with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("./#/lesson/06-4");
    await expect(
      page.getByRole("heading", { name: "Tự kiểm tra" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("main learning screens have no serious accessibility violations", async ({
  page,
}) => {
  for (const route of ["", "#/lesson/01-1", "#/roadmap", "#/settings"]) {
    await page.goto("./" + route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (route === "") {
      // Sample contrast after the entrance fade, rather than at a transient opacity.
      await expect(page.locator(".architecture")).toHaveCSS("opacity", "1");
    }
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
  }
});

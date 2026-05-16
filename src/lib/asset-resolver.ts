// Resolves product image filenames (stored in DB) to bundled Vite assets.
const assetMap = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(assetMap)) {
  const name = path.split("/").pop()!;
  byName[name] = url;
  byName[name.toLowerCase()] = url;
}

export function resolveAsset(filename: string | null | undefined): string {
  if (!filename) return "";
  if (filename.startsWith("http") || filename.startsWith("data:") || filename.startsWith("/")) return filename;
  return byName[filename] ?? byName[filename.toLowerCase()] ?? filename;
}

export function resolveImages(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => resolveAsset(String(x))).filter(Boolean);
}

export const assetPath = (path: string) => {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
};

export const thumbnailPath = (path: string) => {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!normalizedPath.startsWith('works/')) return assetPath(path);

  const withoutWorksPrefix = normalizedPath.slice('works/'.length);
  const webpPath = withoutWorksPrefix.replace(/\.[^.]+$/, '.webp');
  return assetPath(`/works/thumbs/${webpPath}`);
};

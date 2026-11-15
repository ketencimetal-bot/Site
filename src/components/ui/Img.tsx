/**
 * Önceden optimize edilmiş WebP görseller için duyarlı <img>.
 * `name` → /img/{name}-s.webp (≤640px) ve /img/{name}.webp (≤1280px)
 */
type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  name: string;
  sizes?: string;
  priority?: boolean;
};

export default function Img({ name, sizes = "100vw", priority = false, alt = "", ...rest }: Props) {
  return (
    <img
      src={`/img/${name}.webp`}
      srcSet={`/img/${name}-s.webp 640w, /img/${name}.webp 1280w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}

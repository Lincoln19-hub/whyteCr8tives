import type { GalleryImage } from "@/data/galleries";

type MarqueeProps = {
  images: GalleryImage[];
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
};

/** Infinite scrolling strip of images — the signature detail of the original site. */
export default function Marquee({
  images,
  duration = 60,
  reverse = false,
}: MarqueeProps) {
  // duplicate the set so the loop is seamless
  const loop = [...images, ...images];

  return (
    <div
      className={`marquee${reverse ? " marquee--rev" : ""}`}
      aria-hidden="true"
    >
      <div className="marquee__track" style={{ ["--dur" as string]: `${duration}s` }}>
        {loop.map((image, i) => (
          <figure className="marquee__item" key={`${image.src}-${i}`} style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  );
}

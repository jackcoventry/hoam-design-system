import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/Button/Button";
import "./ImageGallery.css";

type ImageItem = { src: string; alt?: string };

type ImageGalleryProps = {
  images: ImageItem[];
  initialIndex?: number;
  className?: string;
};

export default function ImageGallery({
  images,
  initialIndex = 0,
  className,
}: Readonly<ImageGalleryProps>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Current slide index
  const [index, setIndex] = useState(
    images.length ? Math.min(Math.max(initialIndex, 0), images.length - 1) : 0
  );

  // Generated id for aria-controls and references
  const idBase = useMemo(
    () => `hoam-carousel-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  // If there are no images, render a message instead
  if (!images || images.length === 0) {
    return (
      <section
        className={clsx("hoam-carousel", className)}
        aria-roledescription="carousel"
        aria-label="Image carousel"
      >
        <p className="hoam-carousel__empty">No images.</p>
      </section>
    );
  }

  // Scroll to initial slide after mount (no animation)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft, top: 0 });
    // run only once on mount
  }, []);

  // Track index while the user swipes/drags/scrolls
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const first = el.firstElementChild as HTMLElement | null;
        const slideWidth = first?.clientWidth ?? 1;
        const current = Math.round(el.scrollLeft / slideWidth);
        if (current !== index) setIndex(current);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [index]);

  const goTo = (target: number, smooth = true) => {
    const el = viewportRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(images.length - 1, target));
    const slide = el.children[clamped] as HTMLElement | undefined;
    if (slide) {
      el.scrollTo({
        left: slide.offsetLeft,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(images.length - 1);
    }
  };

  return (
    <section
      className={clsx("hoam-carousel", className)}
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <div className="hoam-carousel__header">
        <Button
          className="hoam-carousel__btn"
          onClick={prev}
          aria-label="Previous slide"
          aria-controls={idBase}
          disabled={index === 0}
          icon="arrow-left"
        />

        <div className="hoam-carousel__status" aria-live="polite">
          {index + 1} / {images.length}
        </div>

        <Button
          className="hoam-carousel__btn"
          onClick={next}
          aria-label="Next slide"
          aria-controls={idBase}
          disabled={index === 0}
          icon="arrow-right"
        />
      </div>

      <div
        id={idBase}
        ref={viewportRef}
        className="hoam-carousel__viewport"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {images.map((img, i) => (
          <figure
            key={i}
            className="hoam-carousel__slide"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${images.length}`}
          >
            <div className="hoam-carousel__media">
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          </figure>
        ))}
      </div>

      <div
        className="hoam-carousel__thumbs"
        role="tablist"
        aria-label="Slide thumbnails"
      >
        {images.map((img, i) => {
          const active = i === index;
          return (
            <button
              key={img.src + i}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={idBase}
              className={"hoam-carousel__thumb" + (active ? " is-active" : "")}
              onClick={() => goTo(i)}
              title={`Go to slide ${i + 1}`}
            >
              <span className="sr-only">{`Slide ${i + 1}`}</span>
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  archiveEntries,
  type PhotographyAsset,
} from "./archive-data";

gsap.registerPlugin(useGSAP);

type ImageQuality = "compressed" | "original";

const IMAGE_QUALITY_STORAGE_KEY = "reflex4:photography:image-quality";

type ViewerState = {
  groupIndex: number;
  photoIndex: number;
};

function formatDate(capturedOn: string) {
  return capturedOn.replaceAll("-", ".");
}

function PhotoVisual({
  photo,
  frame,
  index,
  label,
  preferOriginal = false,
}: {
  photo: PhotographyAsset;
  frame: string;
  index: number;
  label: string;
  preferOriginal?: boolean;
}) {
  const [loadedOriginalSource, setLoadedOriginalSource] = useState<string | null>(
    null,
  );
  const originalSource = preferOriginal ? photo.originalSrc : null;
  const source = originalSource ?? photo.thumbnailSrc;

  if (source) {
    if (originalSource && photo.thumbnailSrc) {
      const originalLoaded = loadedOriginalSource === originalSource;

      return (
        <span
          className="photo-progressive-image"
          data-original-loaded={originalLoaded}
          aria-busy={!originalLoaded}
        >
          <img
            className="photo-progressive-thumbnail"
            src={photo.thumbnailSrc}
            alt=""
            aria-hidden="true"
            decoding="async"
            key={`thumbnail-${photo.thumbnailSrc}`}
          />
          <img
            className="photo-progressive-original"
            src={originalSource}
            alt={photo.alt}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setLoadedOriginalSource(originalSource)}
            key={`original-${originalSource}`}
          />
        </span>
      );
    }

    return (
      <img
        src={source}
        alt={photo.alt}
        loading={preferOriginal ? "eager" : "lazy"}
        decoding="async"
        key={source}
      />
    );
  }

  return (
    <span
      className={`photo-placeholder photo-placeholder--${photo.placeholderTone}`}
      data-frame={`${frame}.${index + 1}`}
      role="img"
      aria-label={photo.alt}
    >
      <span>{label}</span>
      <i>Image source pending</i>
    </span>
  );
}

export function PhotographyArchive() {
  const root = useRef<HTMLDivElement>(null);
  const viewerRoot = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastFocusedTrigger = useRef<HTMLElement | null>(null);
  const reducedMotion = useRef(false);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const [imageQuality, setImageQuality] =
    useState<ImageQuality>("compressed");
  const isViewerOpen = viewer !== null;

  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          reducedMotion.current = Boolean(context.conditions?.reduceMotion);
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  const fanStack = contextSafe(
    (card: HTMLButtonElement, expanded: boolean) => {
      const layers = Array.from(
        card.querySelectorAll<HTMLElement>(".photo-layer"),
      );
      const expandedPositions = [
        { x: 0, y: -15, rotation: 0 },
        { x: -42, y: 13, rotation: -8 },
        { x: 42, y: 13, rotation: 8 },
      ];
      const collapsedPositions = [
        { x: 0, y: 0, rotation: 0 },
        { x: 8, y: -8, rotation: 3 },
        { x: -7, y: -14, rotation: -3 },
      ];

      gsap.killTweensOf(layers);
      layers.forEach((layer, index) => {
        const position = (expanded
          ? expandedPositions
          : collapsedPositions)[index] ?? { x: 0, y: 0, rotation: 0 };

        gsap.to(layer, {
          ...position,
          duration: reducedMotion.current ? 0 : expanded ? 0.48 : 0.32,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    },
  );

  useEffect(() => {
    try {
      const storedQuality = window.localStorage.getItem(
        IMAGE_QUALITY_STORAGE_KEY,
      );
      if (storedQuality === "compressed" || storedQuality === "original") {
        setImageQuality(storedQuality);
      }
    } catch {
      // Storage may be unavailable in a restricted browsing context.
    }

    const syncQuality = (event: StorageEvent) => {
      if (
        event.key === IMAGE_QUALITY_STORAGE_KEY &&
        (event.newValue === "compressed" || event.newValue === "original")
      ) {
        setImageQuality(event.newValue);
      }
    };

    window.addEventListener("storage", syncQuality);
    return () => window.removeEventListener("storage", syncQuality);
  }, []);

  useGSAP(
    () => {
      if (!viewer || !viewerRoot.current) return;

      gsap.fromTo(
        ".photo-viewer-panel",
        {
          y: reducedMotion.current ? 0 : 24,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: reducedMotion.current ? 0 : 0.34,
          ease: "power3.out",
        },
      );
    },
    {
      scope: viewerRoot,
      dependencies: [viewer?.groupIndex ?? -1],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!viewer || !viewerRoot.current) return;

      gsap.fromTo(
        ".photo-viewer-media",
        {
          scale: reducedMotion.current ? 1 : 0.985,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          duration: reducedMotion.current ? 0 : 0.28,
          ease: "power2.out",
        },
      );
    },
    {
      scope: viewerRoot,
      dependencies: [viewer?.photoIndex ?? -1],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (!isViewerOpen) return;

    const scroller = document.querySelector<HTMLElement>(".photography-page");
    const previousOverflow = scroller?.style.overflowY ?? "";
    if (scroller) scroller.style.overflowY = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButton.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setViewer(null);
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setViewer((current) => {
          if (!current) return current;
          const photoCount = archiveEntries[current.groupIndex].photos.length;
          const direction = event.key === "ArrowRight" ? 1 : -1;
          return {
            ...current,
            photoIndex:
              (current.photoIndex + direction + photoCount) % photoCount,
          };
        });
        return;
      }

      if (event.key === "Tab" && viewerRoot.current) {
        const controls = Array.from(
          viewerRoot.current.querySelectorAll<HTMLButtonElement>(
            "[data-viewer-control]",
          ),
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      if (scroller) scroller.style.overflowY = previousOverflow;
      lastFocusedTrigger.current?.focus();
    };
  }, [isViewerOpen]);

  const openViewer = (groupIndex: number, trigger: HTMLButtonElement) => {
    lastFocusedTrigger.current = trigger;
    setViewer({ groupIndex, photoIndex: 0 });
  };

  const moveViewer = (direction: 1 | -1) => {
    setViewer((current) => {
      if (!current) return current;
      const photoCount = archiveEntries[current.groupIndex].photos.length;
      return {
        ...current,
        photoIndex: (current.photoIndex + direction + photoCount) % photoCount,
      };
    });
  };

  const selectImageQuality = (quality: ImageQuality) => {
    setImageQuality(quality);
    try {
      window.localStorage.setItem(IMAGE_QUALITY_STORAGE_KEY, quality);
    } catch {
      // Keep the in-memory selection when storage is unavailable.
    }
  };

  const activeGroup = viewer ? archiveEntries[viewer.groupIndex] : null;
  const activePhoto = activeGroup && viewer
    ? activeGroup.photos[viewer.photoIndex]
    : null;
  const activeExif: Array<[string, string, string | null]> = activePhoto
    ? [
        ["相机", "Camera", activePhoto.exif.camera],
        ["镜头", "Lens", activePhoto.exif.lens],
        ["光圈", "Aperture", activePhoto.exif.aperture],
        ["快门", "Shutter", activePhoto.exif.shutterSpeed],
        ["感光度", "ISO", activePhoto.exif.iso],
        ["焦距", "Focal length", activePhoto.exif.focalLength],
      ]
    : [];

  return (
    <div className="photo-archive-content" ref={root}>
      <section className="photo-intro" aria-labelledby="photography-title">
        <div className="photo-intro-heading">
          <p className="eyebrow">Light / Time / Observation</p>
          <h1 id="photography-title">
            沿时间
            <br />
            <em>观看</em>
          </h1>
        </div>

        <div className="photo-intro-axis" aria-hidden="true">
          <span>Now</span>
          <b>2026</b>
        </div>

        <div className="photo-intro-copy">
          <span className="photo-record-count">
            {archiveEntries.length.toString().padStart(2, "0")} Sets / Newest First
          </span>
          <p>
            每个日期收录一组照片。悬停展开层叠影像，点击后从精选图片开始，
            再用按钮或左右方向键逐张观看。
          </p>
          <a href="#photo-timeline">滚轮向下 · 查看更早作品 ↓</a>
        </div>
      </section>

      <section
        className="photo-timeline"
        id="photo-timeline"
        aria-label="摄影作品时间轴"
      >
        <div className="photo-timeline-line" aria-hidden="true" />

        {archiveEntries.map((entry, groupIndex) => {
          const frameNumber = (archiveEntries.length - groupIndex)
            .toString()
            .padStart(2, "0");

          return (
            <article
              className={`photo-event photo-event--${groupIndex % 2 === 0 ? "left" : "right"}`}
              key={entry.id}
            >
              <button
                className="photo-card"
                type="button"
                aria-haspopup="dialog"
                aria-label={`打开 ${entry.title}，共 ${entry.photos.length} 张照片`}
                onPointerEnter={(event) => fanStack(event.currentTarget, true)}
                onPointerLeave={(event) => fanStack(event.currentTarget, false)}
                onFocus={(event) => fanStack(event.currentTarget, true)}
                onBlur={(event) => fanStack(event.currentTarget, false)}
                onClick={(event) => openViewer(groupIndex, event.currentTarget)}
              >
                <span className="photo-stack photo-stack--landscape">
                  {entry.photos.slice(0, 3).map((photo, photoIndex) => (
                    <span
                      className={`photo-layer photo-layer--${photo.format}`}
                      data-stack-index={photoIndex}
                      key={photo.id}
                    >
                      <PhotoVisual
                        photo={photo}
                        frame={frameNumber}
                        index={photoIndex}
                        label={photoIndex === 0 ? "Selected" : "Thumbnail"}
                      />
                    </span>
                  ))}
                </span>

                <span className="photo-card-caption">
                  <span>
                    <span className="photo-sequence">Set / {frameNumber}</span>
                    <strong>{entry.title}</strong>
                  </span>
                  <span className="photo-location">{entry.location}</span>
                </span>

                <time className="photo-card-date" dateTime={entry.capturedOn}>
                  {formatDate(entry.capturedOn)}
                </time>

                <span className="photo-card-action">
                  Open set / {entry.photos.length.toString().padStart(2, "0")} photos ↗
                </span>
              </button>

              <div className="photo-axis-label">
                <span aria-hidden="true" />
                <time dateTime={entry.capturedOn}>
                  <strong>{formatDate(entry.capturedOn)}</strong>
                </time>
              </div>
            </article>
          );
        })}

        <div className="photo-timeline-end">
          <span aria-hidden="true" />
          <p>Archive continues</p>
          <b>更早的照片将在这里继续生长</b>
        </div>
      </section>

      <footer className="photo-footer">
        <span>reflex4 / Photographic Archive</span>
        <span>Thumbnail first · Original on demand</span>
        <a href="/">返回首页 ↗</a>
      </footer>

      {viewer && activeGroup && activePhoto ? (
        <div
          className="photo-viewer-backdrop"
          ref={viewerRoot}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-viewer-title"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setViewer(null);
          }}
        >
          <div className="photo-viewer-panel">
            <header className="photo-viewer-header">
              <span>Selected photographs / {formatDate(activeGroup.capturedOn)}</span>
              <button
                type="button"
                ref={closeButton}
                data-viewer-control
                onClick={() => setViewer(null)}
                aria-label="关闭图片浏览器"
              >
                Close ×
              </button>
            </header>

            <div className="photo-viewer-body">
              <div
                className={`photo-viewer-media photo-viewer-media--${activePhoto.format}`}
              >
                <PhotoVisual
                  key={`${activePhoto.id}:${imageQuality}`}
                  photo={activePhoto}
                  frame={(archiveEntries.length - viewer.groupIndex)
                    .toString()
                    .padStart(2, "0")}
                  index={viewer.photoIndex}
                  label={
                    imageQuality === "original"
                      ? "Original preview"
                      : "Compressed preview"
                  }
                  preferOriginal={imageQuality === "original"}
                />
              </div>

              <aside className="photo-viewer-copy">
                <div className="photo-viewer-heading">
                  <span className="photo-sequence">
                    Photo / {(viewer.photoIndex + 1).toString().padStart(2, "0")}
                  </span>
                  <h2 id="photo-viewer-title">{activeGroup.title}</h2>
                  <p>{activeGroup.location}</p>
                </div>

                <div className="photo-quality-control">
                  <div>
                    <span>Image source</span>
                    <b>{imageQuality === "original" ? "原图模式" : "压缩图模式"}</b>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={imageQuality === "original"}
                    aria-label="切换压缩图和原图显示"
                    data-quality={imageQuality}
                    data-viewer-control
                    onClick={() =>
                      selectImageQuality(
                        imageQuality === "compressed" ? "original" : "compressed",
                      )
                    }
                  >
                    <span>压缩图</span>
                    <i aria-hidden="true">
                      <b />
                    </i>
                    <span>原图</span>
                  </button>
                  <small>选择会保存在本机，并用于其他照片组</small>
                </div>

                <section className="photo-exif" aria-label="照片 EXIF 信息">
                  <header>
                    <span>EXIF / Reserved</span>
                    <b>Metadata</b>
                  </header>
                  <dl>
                    {activeExif.map(([label, englishLabel, value]) => (
                      <div key={englishLabel}>
                        <dt>
                          <span>{label}</span>
                          {englishLabel}
                        </dt>
                        <dd>{value ?? "待接入"}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <div className="photo-viewer-index">
                  <strong aria-live="polite">
                    {(viewer.photoIndex + 1).toString().padStart(2, "0")} / {activeGroup.photos.length.toString().padStart(2, "0")}
                  </strong>
                  <small>← → 方向键切换 · Esc 关闭</small>
                </div>
              </aside>
            </div>

            <footer className="photo-viewer-controls">
              <button
                type="button"
                data-viewer-control
                onClick={() => moveViewer(-1)}
                aria-label="查看上一张照片"
              >
                ← 上一张
              </button>
              <span>
                {imageQuality === "original"
                  ? activePhoto.originalSrc
                    ? "Original requested"
                    : "Original source pending"
                  : "Compressed preview active"}
              </span>
              <button
                type="button"
                data-viewer-control
                onClick={() => moveViewer(1)}
                aria-label="查看下一张照片"
              >
                下一张 →
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}

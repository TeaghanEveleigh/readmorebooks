"use client";

import Image from "next/image";
import * as React from "react";
import type { Book as BookType} from "@/lib/types";
import { sanitiseGoogleHtml } from "@/lib/sanatise"


// Optional icons if you have lucide-react installed; otherwise swap for text labels.
import { ExternalLink, BookOpen, ShoppingCart, Star, Book } from "lucide-react";
import { getBookCover, toHttps } from "@/lib/utils";

type Props = {
  book: BookType;
  compact?: boolean; // if you want a smaller variant later
  onAddToLibrary?: (book: BookType) => void;
};

function getThumb(book: BookType) {
    console.log("book is the following in info" , book)
  const imagelink = book.volumeInfo.imageLinks || {};
  return (
    imagelink.extraLarge ||
    imagelink.large ||
    imagelink.medium ||
    imagelink.small ||
    imagelink.thumbnail ||
    imagelink.smallThumbnail ||
    "/placeholder-book.png"
  );
}

function getIsbn(book: BookType, kind: "ISBN_10" | "ISBN_13") {
  return book.volumeInfo.industryIdentifiers?.find((x) => x.type === kind)?.identifier;
}

function roundRating(r?: number) {
  if (typeof r !== "number" || isNaN(r)) return undefined;
  return Math.max(0, Math.min(5, Math.round(r * 2) / 2)); // nearest 0.5
}

function Stars({ value }: { value?: number }) {
  if (value == null) return null;
  const filled = Math.floor(value);
  const half = value - filled >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return (
    <div className="inline-flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: filled }).map((_, i) => <Star key={`f${i}`} size={16} className="fill-current" />)}
      {half && <Star size={16} className="fill-current [clip-path:inset(0_50%_0_0)]" />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} size={16} className="opacity-30" />)}
      <span className="ml-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">{value.toFixed(1)}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  if (!children && children !== 0) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="w-28 shrink-0 text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function linkBtn(href?: string, label?: React.ReactNode, className?: string) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`accent-btn rounded-lg px-3 py-2 text-sm ${className || ""}`}
    >
      <span className="inline-flex items-center gap-2">{label}</span>
    </a>
  );
}

function currency(p?: { amount: number; currencyCode: string }) {
  if (!p?.amount || !p.currencyCode) return undefined;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: p.currencyCode }).format(p.amount);
  } catch {
    return `${p.amount} ${p.currencyCode}`;
  }
}

export default function BookInfo({ book }: Props) {
    console.log("book is " , book)
  const [expanded, setExpanded] = React.useState(false);
  const volumeInfo = book.volumeInfo || {};
  const saleInfo = book.saleInfo || {};
  const accessInfo = book.accessInfo || {};
  const avergeRating = roundRating(volumeInfo.averageRating);

  const isbn10 = getIsbn(book, "ISBN_10");
  const isbn13 = getIsbn(book, "ISBN_13");

  const price =
    saleInfo.retailPrice ? currency(saleInfo.retailPrice) :
    saleInfo.listPrice ? currency(saleInfo.listPrice) :
    undefined;

  const catList = volumeInfo?.categories?.slice(0, 6) ?? [];

  const preview = volumeInfo?.previewLink;
  const info = volumeInfo?.canonicalVolumeLink || volumeInfo?.infoLink;
  const buy = saleInfo.buyLink;
    const rawDesc = volumeInfo?.description || ""
    const cleanHtml = React.useMemo(() => sanitiseGoogleHtml(rawDesc), [rawDesc])

    const desc = React.useMemo(() => sanitiseGoogleHtml(rawDesc), [rawDesc])
  const isLong = desc.length > 500;
  const shown = expanded || !isLong ? desc : desc.slice(0, 500) + "…";
  const thumbnail = toHttps(getThumb(book)) 
  console.log(thumbnail)



  return (
    <article className="surface-card p-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Cover */}
        <div className="w-full md:w-48 lg:w-56">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-light-border dark:border-dark-border bg-light-secondary/50 dark:bg-dark-secondary/50">
            <img
              src={thumbnail}
              alt={volumeInfo.title || "Book cover"}
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{volumeInfo.title}</h1>
          {volumeInfo.subtitle && <p className="mt-1 text-base text-light-text-secondary dark:text-dark-text-secondary">{volumeInfo.subtitle}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {volumeInfo.authors?.length ? <span>{volumeInfo.authors.join(", ")}</span> : <span className="opacity-60">Unknown author</span>}
            {avergeRating != null && (
              <>
                <span className="opacity-40">•</span>
                <Stars value={avergeRating} />
                {volumeInfo.ratingsCount ? <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">({volumeInfo.ratingsCount.toLocaleString()})</span> : null}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {preview && linkBtn(preview, <><BookOpen size={16} /> Preview</>)}
            {info && linkBtn(info, <><ExternalLink size={16} /> More info</>, "bg-transparent text-current border border-light-border dark:border-dark-border hover:bg-light-secondary/60 dark:hover:bg-dark-secondary/60")}
            {buy && linkBtn(buy, <><ShoppingCart size={16} /> Buy</>)}
            
          </div>

          {/* Categories */}
          {catList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {catList.map((c : any) => (
                <span key={c} className="inline-flex items-center rounded-full border border-light-border dark:border-dark-border px-2 py-0.5 text-xs">
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}

{desc && (
  <div className="mt-5">
    <h3 className="text-sm font-semibold mb-2">Synopsis</h3>

    <div className="relative">
      {/* Collapsed state: limit height, add gradient */}
      <div className={expanded ? "" : "max-h-48 overflow-hidden"}>
        <div
          className="text-sm leading-6"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>

      {!expanded && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12
                        bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
      )}
    </div>

    <button
      className="mt-2 text-sm accent hover:underline"
      onClick={() => setExpanded((x) => !x)}
    >
      {expanded ? "Show less" : "Show more"}
    </button>
  </div>
)}

        </div>
      </div>

      {/* Details grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Publisher">{volumeInfo.publisher}</Field>
        <Field label="Published">{volumeInfo.publishedDate}</Field>
        <Field label="Pages">{volumeInfo.pageCount}</Field>
        <Field label="Language">{volumeInfo.language?.toUpperCase()}</Field>
        <Field label="Print type">{volumeInfo.printType}</Field>
        <Field label="Maturity">{volumeInfo.maturityRating}</Field>
        <Field label="ISBN-13">{isbn13}</Field>
        <Field label="ISBN-10">{isbn10}</Field>
        <Field label="Saleability">{saleInfo.saleability}</Field>
        <Field label="eBook">{saleInfo.isEbook ? "Yes" : saleInfo.isEbook === false ? "No" : undefined}</Field>
        <Field label="Price">{price}</Field>
        <Field label="Viewability">{accessInfo.viewability}</Field>
        <Field label="Web reader">
          {accessInfo.webReaderLink ? (
            <a className="accent hover:underline" href={accessInfo.webReaderLink} target="_blank" rel="noopener noreferrer">
              Open
            </a>
          ) : undefined}
        </Field>
        <Field label="Content version">{volumeInfo.contentVersion}</Field>
        <Field label="Reading modes">
          {(volumeInfo.readingModes?.text ? "Text" : "") + (volumeInfo.readingModes?.image ? (volumeInfo.readingModes?.text ? " & " : "") + "Image" : "") || undefined}
        </Field>
      </div>

      {/* Search snippet if present */}
      {book.searchInfo?.textSnippet && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-1">Search snippet</h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{book.searchInfo.textSnippet}</p>
        </div>
      )}
    </article>
  );
}

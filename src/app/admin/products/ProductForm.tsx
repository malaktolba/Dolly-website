"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { categories, collections, type Category, type CollectionSlug, type Product } from "@/lib/catalog";
import { deleteProductAction, importImage, saveProductAction, uploadImage } from "../actions";

const input =
  "w-full border-b border-cocoa/25 bg-transparent py-2.5 text-sm outline-none placeholder:text-cocoa/35 focus:border-cocoa";
const SIZE_PRESETS = [["S", "M", "L"], ["S-M", "L-XL"], ["One size"]];

/** Shrinks a photo to at most 1600px on its long edge and re-encodes it as JPEG before upload. */
async function resizeForWeb(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process photo"))), "image/jpeg", 0.85),
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [code, setCode] = useState(product?.code ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [salePrice, setSalePrice] = useState(product?.salePrice ? String(product.salePrice) : "");
  const [category, setCategory] = useState<Category | "">(product?.category ?? "");
  const [inCollections, setInCollections] = useState<CollectionSlug[]>(product?.collections ?? []);
  const [color, setColor] = useState(product?.color ?? "");
  const [style, setStyle] = useState(product?.style ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [modelWears, setModelWears] = useState(product?.modelWears ?? "");
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [sizes, setSizes] = useState(
    product ? product.sizes.map((s) => ({ size: s, stock: String(product.stock[s] ?? 0) })) : [{ size: "", stock: "0" }],
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    for (const [i, file] of Array.from(files).entries()) {
      setBusy(`Uploading photo ${i + 1} of ${files.length}…`);
      try {
        const fd = new FormData();
        fd.append("file", new File([await resizeForWeb(file)], "photo.jpg", { type: "image/jpeg" }));
        const res = await uploadImage(fd);
        if ("error" in res) throw new Error(res.error);
        setImages((prev) => [...prev, res.url]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
        break;
      }
    }
    setBusy(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const external = images.filter((u) => u.startsWith("http"));
  const copyToStorage = async () => {
    setError(null);
    for (const [i, url] of external.entries()) {
      setBusy(`Copying photo ${i + 1} of ${external.length}…`);
      const res = await importImage(url);
      if ("error" in res) {
        setError(res.error);
        break;
      }
      setImages((prev) => prev.map((u) => (u === url ? res.url : u)));
    }
    setBusy(null);
  };

  const move = (i: number, d: number) =>
    setImages((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startSaving(async () => {
      const res = await saveProductAction(product?.id ?? null, {
        name,
        slug,
        code,
        price: Number(price),
        salePrice: salePrice === "" ? null : Number(salePrice),
        category: category as Category,
        collections: inCollections,
        color,
        style,
        description,
        modelWears,
        visible,
        images,
        sizes: sizes.map((s) => ({ size: s.size, stock: Number(s.stock) })),
      });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={onSave} className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        {/* Basics */}
        <section className="grid gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="label text-cocoa-soft">Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Terra Dress" />
          </label>
          <label>
            <span className="label text-cocoa-soft">Product code</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} className={input} placeholder="SS26-05" />
          </label>
          <label>
            <span className="label text-cocoa-soft">Web address</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={input} placeholder="Made from the name if empty" />
          </label>
          <label>
            <span className="label text-cocoa-soft">Price (EGP)</span>
            <input required type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} className={input} />
          </label>
          <label>
            <span className="label text-cocoa-soft">Sale price (optional)</span>
            <input type="number" min={1} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={input} placeholder="Empty = not on sale" />
          </label>
          <label>
            <span className="label text-cocoa-soft">Category</span>
            <select required value={category} onChange={(e) => setCategory(e.target.value as Category)} className={`${input} cursor-pointer`}>
              <option value="" disabled>
                Choose…
              </option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="label text-cocoa-soft">Collections</legend>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {collections.map((c) => (
                <label key={c.slug} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-cocoa"
                    checked={inCollections.includes(c.slug)}
                    onChange={(e) =>
                      setInCollections((prev) => (e.target.checked ? [...prev, c.slug] : prev.filter((x) => x !== c.slug)))
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        {/* Details */}
        <section className="grid gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="label text-cocoa-soft">Description</span>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${input} resize-y`} />
          </label>
          <label>
            <span className="label text-cocoa-soft">Colour</span>
            <input value={color} onChange={(e) => setColor(e.target.value)} className={input} placeholder="Chalk beige" />
          </label>
          <label>
            <span className="label text-cocoa-soft">Model wears size</span>
            <input value={modelWears} onChange={(e) => setModelWears(e.target.value)} className={input} placeholder="S" />
          </label>
          <label className="sm:col-span-2">
            <span className="label text-cocoa-soft">Style</span>
            <input value={style} onChange={(e) => setStyle(e.target.value)} className={input} placeholder="Straight fit, classic width" />
          </label>
        </section>

        {/* Sizes & stock */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label text-cocoa-soft">Sizes & stock</p>
            <div className="flex gap-2">
              {SIZE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.join()}
                  onClick={() => setSizes(preset.map((s) => ({ size: s, stock: sizes.find((x) => x.size === s)?.stock ?? "0" })))}
                  className="label !text-[0.625rem] border border-sand px-2 py-1 hover:border-cocoa"
                >
                  {preset.join(" / ")}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {sizes.map((s, i) => (
              <li key={i} className="flex items-end gap-4">
                <label className="flex-1">
                  <span className="sr-only">Size</span>
                  <input
                    value={s.size}
                    onChange={(e) => setSizes((prev) => prev.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)))}
                    className={input}
                    placeholder="Size, e.g. M"
                  />
                </label>
                <label className="w-28">
                  <span className="sr-only">Stock</span>
                  <input
                    type="number"
                    min={0}
                    value={s.stock}
                    onChange={(e) => setSizes((prev) => prev.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)))}
                    className={input}
                  />
                </label>
                <span className="pb-2.5 text-xs text-cocoa-soft">in stock</span>
                <button
                  type="button"
                  onClick={() => setSizes((prev) => prev.filter((_, j) => j !== i))}
                  className="label pb-2.5 text-cocoa-soft hover:text-cocoa"
                  aria-label={`Remove size ${s.size}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setSizes((prev) => [...prev, { size: "", stock: "0" }])} className="label mt-4 link-line">
            + Add size
          </button>
        </section>
      </div>

      <div className="space-y-10 lg:col-span-5">
        {/* Photos */}
        <section>
          <p className="label text-cocoa-soft">Photos</p>
          <p className="mt-1 text-xs text-cocoa-soft">The first photo is the main one. The second shows when hovering in the shop.</p>
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {images.map((src, i) => (
              <li key={src} className="group relative aspect-[3/4] bg-sand">
                <Image src={src} alt="" fill sizes="150px" className="object-cover" />
                {i === 0 && <span className="label absolute left-1 top-1 bg-cream px-1.5 py-0.5 !text-[0.55rem]">Main</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-cocoa/70 text-cream opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} className="px-2 py-1" aria-label="Move photo left">
                    ←
                  </button>
                  <button type="button" onClick={() => setImages((p) => p.filter((u) => u !== src))} className="px-2 py-1 text-xs" aria-label="Remove photo">
                    Remove
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="px-2 py-1" aria-label="Move photo right">
                    →
                  </button>
                </div>
              </li>
            ))}
            <li>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => fileInput.current?.click()}
                className="flex aspect-[3/4] w-full flex-col items-center justify-center border border-dashed border-cocoa/30 text-cocoa-soft hover:border-cocoa hover:text-cocoa disabled:opacity-50"
              >
                <span className="text-2xl">+</span>
                <span className="label !text-[0.6rem]">Upload</span>
              </button>
            </li>
          </ul>
          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />

          <div className="mt-4 flex items-end gap-3">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={input} placeholder="…or paste a photo link (https://)" />
            <button
              type="button"
              onClick={() => {
                if (/^https:\/\/\S+$/.test(imageUrl)) {
                  setImages((p) => [...p, imageUrl]);
                  setImageUrl("");
                }
              }}
              className="label pb-2.5 link-line"
            >
              Add
            </button>
          </div>
          {external.length > 0 && (
            <button type="button" disabled={!!busy} onClick={copyToStorage} className="label mt-4 link-line text-cocoa-soft disabled:opacity-50">
              Copy {external.length} linked photo{external.length > 1 ? "s" : ""} into Dolly&apos;s storage
            </button>
          )}
          {busy && <p className="mt-3 text-sm text-cocoa-soft">{busy}</p>}
        </section>

        {/* Visibility & save */}
        <section className="bg-cream p-6">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="accent-cocoa" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            Show in the shop
          </label>
          <p className="mt-1 pl-6 text-xs text-cocoa-soft">Untick to hide it without deleting it.</p>
          {error && (
            <p role="alert" className="mt-5 text-sm text-blush-deep">
              {error}
            </p>
          )}
          <button disabled={saving || !!busy} className="label mt-6 w-full bg-cocoa py-4 text-cream hover:bg-cocoa/85 disabled:opacity-60">
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </section>

      </div>
    </form>
  );
}

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? Past orders keep their details. This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="label text-cocoa-soft link-line">Delete product</button>
    </form>
  );
}

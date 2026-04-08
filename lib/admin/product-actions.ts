"use server";

import { productFromSimpleFields } from "lib/admin/product-model";
import { TAGS } from "lib/constants";
import { createClient } from "lib/supabase/server";
import type { Product } from "lib/types";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type SaveProductState = { message?: string };

export async function saveProduct(
  _prev: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  const rowId = String(formData.get("rowId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const sortRaw = String(formData.get("sortIndex") ?? "0").trim();
  const active = formData.get("active") === "on";
  const availableForSale = formData.get("availableForSale") === "on";
  const existingId = String(formData.get("productId") ?? "").trim();
  const existingVariantId = String(formData.get("variantId") ?? "").trim();

  if (!title) return { message: "Title is required." };
  if (!handleInput) return { message: "Handle (URL slug) is required." };
  if (!description) return { message: "Description is required." };
  if (!imageUrl) return { message: "Image URL is required." };

  let imageOk = false;
  try {
    const u = new URL(imageUrl);
    imageOk = u.protocol === "http:" || u.protocol === "https:";
  } catch {
    imageOk = false;
  }
  if (!imageOk) return { message: "Enter a valid http(s) image URL." };

  const price = Number.parseFloat(priceRaw);
  if (Number.isNaN(price) || price <= 0) {
    return { message: "Enter a valid price greater than zero." };
  }

  const sortIndex = Number.parseInt(sortRaw, 10);
  if (Number.isNaN(sortIndex)) {
    return { message: "Sort index must be a number." };
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const product = productFromSimpleFields({
    existingId: existingId || undefined,
    existingVariantId: existingVariantId || undefined,
    handleInput,
    title,
    description,
    priceUsd: price,
    imageUrl,
    tags,
    sortIndex,
    availableForSale,
  });

  const supabase = await createClient();

  if (rowId) {
    const { error } = await supabase
      .from("products")
      .update({
        handle: product.handle,
        data: product,
        active,
        sort_index: product.sortIndex,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rowId);

    if (error) {
      return { message: error.message };
    }
  } else {
    const { error } = await supabase.from("products").insert({
      handle: product.handle,
      data: product,
      active,
      sort_index: product.sortIndex,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { message: error.message };
    }
  }

  updateTag(TAGS.products);
  updateTag(TAGS.collections);
  redirect("/admin/products");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const makeActive = formData.get("nextActive") === "true";
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active: makeActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return;

  updateTag(TAGS.products);
  updateTag(TAGS.collections);
}

export async function updateSortIndex(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("sortIndex") ?? "0");
  const sortIndex = Number.parseInt(raw, 10);
  if (!id || Number.isNaN(sortIndex)) return;

  const supabase = await createClient();
  const { data: row, error: fetchError } = await supabase
    .from("products")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !row?.data) return;

  const productData = row.data as Product;
  const nextData: Product = { ...productData, sortIndex };

  const { error } = await supabase
    .from("products")
    .update({
      sort_index: sortIndex,
      data: nextData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return;

  updateTag(TAGS.products);
  updateTag(TAGS.collections);
}

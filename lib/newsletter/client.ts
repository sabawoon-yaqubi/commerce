export type NewsletterSource = "footer" | "welcome";

export async function subscribeToNewsletter(
  email: string,
  source: NewsletterSource,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const trimmed = email.trim();
  let res: Response;
  try {
    res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed, source }),
    });
  } catch {
    return {
      ok: false,
      message: "Network error. Please try again.",
    };
  }

  let body: { ok?: boolean; error?: string } = {};
  try {
    body = (await res.json()) as { ok?: boolean; error?: string };
  } catch {
    /* ignore */
  }

  if (res.ok && body.ok !== false) {
    return { ok: true };
  }

  const message =
    typeof body.error === "string" && body.error.length > 0
      ? body.error
      : res.status === 503
        ? "Newsletter signup is temporarily unavailable."
        : "Something went wrong. Please try again.";

  return { ok: false, message };
}

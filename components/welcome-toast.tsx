"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("Welcome", {
        id: "welcome-toast",
        duration: 5000,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description:
          "Explore our collection of premium eyewear. Browse, discover, and find your perfect frame.",
      });
    }
  }, []);

  return null;
}

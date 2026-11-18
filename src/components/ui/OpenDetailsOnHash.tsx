"use client";

import { useEffect } from "react";

export default function OpenDetailsOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const element = id ? document.getElementById(id) : null;
      if (element instanceof HTMLDetailsElement) element.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return null;
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.documentElement.classList.add("dark");

// One-time migration: remove old bot/seed comments (IDs "1","2","3","4")
if (!localStorage.getItem("kusokabu_migrated_v1")) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sjbbs_")) {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem("kusokabu_migrated_v1", "1");
}

createRoot(document.getElementById("root")!).render(<App />);

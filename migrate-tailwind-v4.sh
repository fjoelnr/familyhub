#!/usr/bin/env bash
set -e

echo "🔄 Starte Migration auf Tailwind CSS v4 …"

# 1) Entferne alte Tailwind v3 + Autoprefixer (evtl. postcss-alte Config)
npm uninstall tailwindcss@^3 autoprefixer || true

# 2) Installiere Tailwind CSS v4 + PostCSS-Plugin
npm install -D tailwindcss@latest @tailwindcss/postcss postcss

# 3) Entferne alte Config-Dateien (tailwind.config.js / .cjs / .ts) falls vorhanden
if [ -f tailwind.config.js ] || [ -f tailwind.config.cjs ] || [ -f tailwind.config.ts ]; then
  echo "📄 Entferne alte tailwind.config.js / .cjs / .ts"
  rm -f tailwind.config.js tailwind.config.cjs tailwind.config.ts
fi

# 4) Erstelle neue PostCSS-Config (postcss.config.mjs)
echo "📄 Erstelle postcss.config.mjs"
cat > postcss.config.mjs << 'EOF'
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
EOF

# 5) Passe globals.css an: ersetze @tailwind-Direktiven durch @import
CSS_FILE="app/globals.css"
if [ -f "$CSS_FILE" ]; then
  echo "🧷 Passe $CSS_FILE an (Tailwind-v4-Import)"
  # Entferne Zeilen mit @tailwind base/components/utilities, falls vorhanden
  sed -i '/@tailwind base;/d' "$CSS_FILE"
  sed -i '/@tailwind components;/d' "$CSS_FILE"
  sed -i '/@tailwind utilities;/d' "$CSS_FILE"
  # Füge @import "tailwindcss"; ganz oben ein, falls nicht vorhanden
  if ! grep -q '@import "tailwindcss"' "$CSS_FILE"; then
    sed -i '1i @import "tailwindcss";' "$CSS_FILE"
  fi
else
  echo "⚠️  Datei $CSS_FILE nicht gefunden — bitte Pfad prüfen."
fi

# 6) Optional: Hinweis für Browser-Kompatibilität
echo "ℹ️  Denk daran: Tailwind v4 nutzt moderne CSS-Features — ggf. Browser-Support prüfen."

echo "✅ Migration auf Tailwind v4 abgeschlossen. Starte jetzt dev-Server:"
echo "   npm run dev"


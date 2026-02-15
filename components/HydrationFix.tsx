"use client";

export function HydrationFix() {
  return (
    <script
      id="hydration-fix"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const cleanup = () => {
              try {
                // Beispiel: mögliche Attribute löschen, die Extensions hinzufügen
                ['data-lt-installed', 'cz-shortcut-listen', 'some-other-attr'].forEach(attr => {
                  if (document.documentElement.hasAttribute(attr)) {
                    document.documentElement.removeAttribute(attr);
                  }
                  if (document.body.hasAttribute(attr)) {
                    document.body.removeAttribute(attr);
                  }
                });
              } catch (e) {
                console.warn('HydrationFix cleanup error', e);
              }
            };

            cleanup();

            const observer = new MutationObserver((mutations) => {
              for (const m of mutations) {
                if (m.type === 'attributes') {
                  cleanup();
                }
              }
            });

            observer.observe(document.documentElement, { attributes: true, subtree: false });
            observer.observe(document.body, { attributes: true, subtree: false });
          })();
        `,
      }}
    ></script>
  );
}

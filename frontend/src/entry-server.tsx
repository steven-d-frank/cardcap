// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="CardCap — Market cap tracking for trading cards. Track Yu-Gi-Oh!, Pokémon, and MTG card values based on real sold prices and graded population data." />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="CardCap" />
          <meta property="og:title" content="CardCap — Market Cap Tracking for Trading Cards" />
          <meta property="og:description" content="Track market caps for Yu-Gi-Oh!, Pokémon, and MTG cards based on real sold prices and graded population data." />
          <meta property="og:url" content={import.meta.env.VITE_OG_URL || "https://cardcap.gg"} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="CardCap — Market Cap Tracking for Trading Cards" />
          <meta name="twitter:description" content="Track market caps for Yu-Gi-Oh!, Pokémon, and MTG cards based on real sold prices and graded population data." />

          <link rel="icon" type="image/svg+xml" href="/images/favicon-light/favicon.svg" id="favicon" />
          <link rel="manifest" href="/images/favicon-light/site.webmanifest" />
          <meta name="theme-color" content="#060a11" media="(prefers-color-scheme: dark)" />
          <meta name="theme-color" content="#060a11" media="(prefers-color-scheme: light)" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />

          <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
          </noscript>

          <script>{`
            (function() {
              try {
                document.documentElement.classList.add('dark');
                var fav = document.getElementById('favicon');
                if (fav) fav.href = '/images/favicon-dark/favicon.svg';
              } catch (e) {}

              var fonts = [
                'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap',
                'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css',
                'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css',
                'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
              ];
              fonts.forEach(function(href) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
              });
            })();
          `}</script>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

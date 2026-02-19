# Preppy Calculator

Internal Development Documentation

------------------------------------------------------------------------

## Stack

-   React 19\
-   TypeScript\
-   Vite\
-   Static build (no backend)\
-   Embedded in TYPO3 via HTML module

------------------------------------------------------------------------

## Development

Install dependencies:

npm install

Start dev server:

npm run dev

------------------------------------------------------------------------

## Build

Create production build:

npm run build

Build output:

/dist

Always deploy the full contents of `/dist`.

------------------------------------------------------------------------

## TYPO3 Integration

### Upload

Upload all files from `/dist` to:

/fileadmin/preppy/

------------------------------------------------------------------------

### Embed (TYPO3 HTML Module)

`<link rel="stylesheet" href="/fileadmin/preppy/index-XXXXX.css">`{=html}

::: {#root}
:::

```{=html}
<script type="module" src="/fileadmin/preppy/index-XXXXX.js"></script>
```
Notes: - Filenames contain hashes and change after each build. - Update
CSS + JS references after rebuilding. - `type="module"` is required. -
Clear TYPO3 cache after deployment.

------------------------------------------------------------------------

## Configuration

### Bundled Config

Edit:

/src/config/config.json

Rebuild required after changes.

------------------------------------------------------------------------

### External Config (Same Origin)

Place JSON in:

/fileadmin/preppy/config.json

Fetch using:

fetch("/fileadmin/preppy/config.json")

Do not use cross-origin fetch.

------------------------------------------------------------------------

## Important

-   Fully client-side application\
-   No backend\
-   No data persistence\
-   PDF export uses browser print dialog\
-   Requires modern browser with ES module support

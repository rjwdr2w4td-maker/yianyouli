# GitHub Pages Images Missing Debug

- Session: `github-images-missing`
- Status: `[OPEN]`
- Symptom: Images still do not appear after two deployed remote-URL fixes.

## Evidence

- GitHub Pages HTML, JavaScript, and CSS all return HTTP 200.
- Dynamic image endpoint rejects some cross-origin requests and uses a redirect chain.
- Direct CDN URL returns HTTP 200 in command-line tests.
- First deployed fix removed old endpoints and added no-referrer; user still saw no images.
- Second deployed fix bypassed the generator and used the final CDN JPEG directly; user still saw no images.
- Therefore the user's browser/network cannot reliably render the external Trae image domain even when GitHub Pages itself works.

## Confirmed Root Cause

External image hosting is unreachable or blocked in the user's actual browser/network path. The application must not depend on that external host for production rendering.

## Final Fix Plan

1. Store the image file under the project's `public/images` directory.
2. Change all generated image references to the GitHub Pages same-origin `/yianyouli/images/...` path via Vite `BASE_URL`.
3. Build, deploy, verify the local image URL returns HTTP 200 from GitHub Pages, then ask the user to confirm.

# Visual Audit: Rendering Failure on Mobile Refresh

**Source**: User-provided Screen Recording (`ScreenRecording_08-05-202600-11-42_1.mp4`)
**URL**: `https://promilaa.vercel.app`
**Severity**: 🔴 Critical (Breaks core UX)

---

## 1. Description of the Bug
The video captures a **Critical Rendering Failure** triggered by a manual page refresh on a mobile browser. 

### Steps to Reproduce (as seen in video):
1.  Navigate to the homepage.
2.  Interact with the hero carousel (arrows).
3.  Perform a manual browser refresh.

### Observed Behavior:
*   **Total Blackout**: Immediately after refresh, the viewport goes completely black for ~3-5 seconds.
*   **Missing Background Assets**: When the UI components (text, buttons, logo) finally appear, the **hero background image/video is missing**.
*   **Fallback Failure**: The text remains visible but is overlaid on a dark, empty background, making the site look broken and unfinished.

---

## 2. Technical Root Cause Analysis (Engineering Perspective)

This is likely a **Hydration Mismatch** or a **Resource Loading Race Condition** specific to Next.js and Vercel's Image Optimization.

1.  **Hydration Mismatch**: The server is sending one state (with the image), but the client-side JavaScript is failing to re-attach to the DOM correctly after the refresh, leaving the image container empty.
2.  **Missing Fallback**: There is no "Skeleton" or "Placeholder" for the hero image. When the image fails to load or takes too long, the site defaults to a black background.
3.  **Vercel Image Optimization (404/504)**: On refresh, the browser may be requesting the optimized image URL from Vercel's edge cache, which might be returning a temporary error or timeout, causing the `<img>` tag to stay hidden.

---

## 3. Recommended Fixes

1.  **Implement Image Placeholders**: Use `placeholder="blur"` or a custom CSS background color for the hero section so the site never looks "black" or "empty."
2.  **Priority Loading**: Add the `priority` attribute to the hero image in Next.js to ensure it is preloaded before other assets.
    ```javascript
    <Image 
      src="/hero.jpg" 
      alt="Promilaa" 
      priority 
      fill 
      className="object-cover"
    />
    ```
3.  **Check for Client-Side Only Code**: Ensure the carousel logic isn't wrapped in a way that prevents it from rendering during the initial mount after a refresh.
4.  **Error Boundaries**: Implement a React Error Boundary to catch rendering crashes and provide a graceful recovery.

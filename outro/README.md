# DataEntropy Outro (reusable)

Approved end card from the 60s brand promo. 7.0s, 30fps. Follows `Brand/brand_guideline.json` logo animation rules.

Timeline: 0–0.5 white lead-in · 0.5–2.0 bars grow L→R, wordmark reveal · 1.9 violet glow sweep · 2.2 tagline · 3.6 CTA button · 4.5 / 5.5 arrow nudge · hold to 7.0.
Audio: SFX only (pops, confirm, whoosh, click, ticks), no music. Fade your video's music out over its last 2–4s, or let it run under the outro at about -18 LUFS.

## Option A — drop-in MP4 (any editor, FFmpeg)

`renders/outro-16x9-<cta>.mp4`, 1920x1080, H.264 + AAC 48kHz. One file per brand-approved CTA:

| file | CTA |
|---|---|
| outro-16x9-follow.mp4 | Follow DataEntropy (default) |
| outro-16x9-learn.mp4 | Learn with DataEntropy |
| outro-16x9-start-building.mp4 | Start building practical data skills |
| outro-16x9-explore-lesson.mp4 | Explore the full lesson |
| outro-16x9-next-project.mp4 | Build your next data project |

Append to a video. Both inputs must be 1920x1080 30fps with an audio track:

```bash
ffmpeg -i main.mp4 -i Brand/outro/renders/outro-16x9-follow.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac -b:a 192k out.mp4
```

## Option B — HyperFrames sub-composition (OpenMontage projects)

1. Copy `16x9/compositions/outro.html` into your project's `compositions/`. Copy `16x9/assets/audio/outro-sfx.wav` into its `assets/audio/`.
2. In your host `index.html`, mount it. The host must load Inter + Noto Sans Bengali, GSAP 3.14.2 and CustomEase `"brand"`, as `16x9/index.html` does:

```html
<div id="m-outro" data-composition-id="outro" data-composition-src="compositions/outro.html"
  data-variable-values='{"cta":"Follow DataEntropy"}'
  data-start="53" data-duration="7" data-track-index="1" data-width="1920" data-height="1080"></div>
<audio id="outro-sfx" src="assets/audio/outro-sfx.wav" data-start="53" data-duration="7" data-volume="1"></audio>
```

`<audio>` must be a direct child of the host root, never inside the sub-composition.

- The only variable is `cta` (string, max 40 chars). Pick it from the brand's `call_to_action.examples`, and use one CTA per video.
- `npx hyperframes render --variables` sets root variables only. Use `data-variable-values` on the mount to set the CTA.
- Fixed brand copy, never edit: the logo, the tagline "Practical Data Skills. Real Career Impact.", and no URL (user decision, 2026-10-15).

## Formats and variants

| folder (HyperFrames source) | renders | size | length |
|---|---|---|---|
| `16x9/` | `outro-16x9-<cta>.mp4` (5 CTAs) | 1920x1080 | 7s |
| `9x16/` | `outro-9x16-<cta>.mp4` (5 CTAs) | 1080x1920 | 7s, vertical lockup, all inside the 9:16 safe area |
| `16x9-short/` | `outro-16x9-short.mp4` | 1920x1080 | 2s, logo + tagline, no CTA |
| `9x16-short/` | `outro-9x16-short.mp4` | 1080x1920 | 2s, logo + tagline, no CTA |

**Which one:**
- **7s (default):** the video's single CTA is the outro button.
- **2s short:** matches the brand `outro_duration_seconds: 2`. Use it when the video already shows its one CTA elsewhere.
- **Never both CTAs:** don't pair an in-video CTA with a 7s outro. The brand allows one CTA per video.

The short versions mount the same way, with `data-composition-id="outroshort"`, `compositions/outro-short.html`, `data-duration="2"` and `assets/audio/outro-short-sfx.wav`.

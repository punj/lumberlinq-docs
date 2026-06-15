# Business Partners Short Recording

`recording.html` is a browser-playable 3-second storyboard generated from the Business Partner documentation screenshots.

In this environment, Chromium could render screenshots, but headless Chromium did not complete the MediaRecorder WebM capture. A true `.webm` or `.mp4` export should be generated in the next pass with one of these options:

- Playwright video recording enabled.
- `ffmpeg` installed for PNG-to-MP4/WebM encoding.
- A normal desktop Chromium session opening `recording.html` and exporting through MediaRecorder.

No application code or database records are required for the recording workflow.

"""Slow, backoff-based transcript fetcher (YouTube rate-limits bulk access)."""
import sys, os, time
from youtube_transcript_api import YouTubeTranscriptApi
src, out = sys.argv[1], sys.argv[2]
todo = [l.rstrip("\n").split("\t") for l in open(src) if l.strip()]
delay = 60
for attempt in range(6):
    left = [p for p in todo if not os.path.exists(os.path.join(out, p[0] + ".txt"))]
    print(f"round {attempt}: {len(left)} left", flush=True)
    if not left: break
    for p in left:
        vid, title, ch = p[0], p[1], p[2]
        try:
            t = YouTubeTranscriptApi().fetch(vid, languages=["en", "en-US", "en-GB"])
            body = "\n".join(f"[{int(s.start)//60}:{int(s.start)%60:02d}] {s.text}" for s in t)
            open(os.path.join(out, vid + ".txt"), "w").write(f"# {title}\n# channel: {ch}\n# url: https://www.youtube.com/watch?v={vid}\n\n{body}")
            print("OK", vid, flush=True); delay = max(45, delay * 0.9)
        except Exception as e:
            n = type(e).__name__; print("FAIL", vid, n, flush=True)
            if n in ("IpBlocked", "RequestBlocked", "TooManyRequests"): delay = min(600, delay * 2)
            elif n in ("TranscriptsDisabled", "NoTranscriptFound", "VideoUnavailable"):
                open(os.path.join(out, vid + ".txt"), "w").write(f"# {title}\n# UNAVAILABLE: {n}\n")
        time.sleep(delay)

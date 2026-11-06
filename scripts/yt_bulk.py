import sys, os, time
from youtube_transcript_api import YouTubeTranscriptApi
api = YouTubeTranscriptApi()
src, out = sys.argv[1], sys.argv[2]
ok = fail = 0
for line in open(src):
    p = line.rstrip("\n").split("\t")
    vid, title, ch = p[0], p[1], p[2]
    fn = os.path.join(out, vid + ".txt")
    if os.path.exists(fn): ok += 1; continue
    try:
        t = api.fetch(vid, languages=["en", "en-US", "en-GB"])
        body = "\n".join(f"[{int(s.start)//60}:{int(s.start)%60:02d}] {s.text}" for s in t)
        open(fn, "w").write(f"# {title}\n# channel: {ch}\n# url: https://www.youtube.com/watch?v={vid}\n\n{body}")
        ok += 1
    except Exception as e:
        fail += 1; print("FAIL", vid, type(e).__name__, flush=True)
    time.sleep(1.5)
print("ok", ok, "fail", fail)

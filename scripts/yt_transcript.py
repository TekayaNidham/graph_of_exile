"""Usage: python yt_transcript.py <video_id> [out_path]  -> plain-text transcript (en)."""
import sys
from youtube_transcript_api import YouTubeTranscriptApi
vid = sys.argv[1]
api = YouTubeTranscriptApi()
t = api.fetch(vid, languages=["en", "en-US", "en-GB"])
text = "\n".join(f"[{int(s.start)//60}:{int(s.start)%60:02d}] {s.text}" for s in t)
if len(sys.argv) > 2:
    open(sys.argv[2], "w").write(text)
    print(f"wrote {len(text)} chars")
else:
    print(text)

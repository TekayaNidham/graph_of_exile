#!/bin/bash
# collect candidate lore videos into index.tsv
Y=.venv/bin/yt-dlp
while IFS= read -r q; do
  [ -z "$q" ] && continue
  timeout 90 $Y "ytsearch8:$q" --flat-playlist --print "%(id)s	%(title)s	%(channel)s	%(duration)s" 2>/dev/null
done <<'Q'
path of exile lore explained full story
path of exile lore act 1
path of exile lore act 6 act 10 kitava
path of exile epilogue lore
path of exile lore vaal atziri doryani
path of exile lore eternal empire chitus malachai
path of exile lore beast
path of exile lore shaper elder
path of exile lore sirus maven
path of exile lore searing exarch eater of worlds
path of exile lore breach xesh tul esh uul-netol chayula
path of exile lore delve aul darkness
path of exile lore incursion alva atzoatl
path of exile lore betrayal syndicate jun catarina
path of exile lore legion timeless conflict
path of exile lore abyss
path of exile lore harvest oshabi
path of exile lore ritual
path of exile lore expedition kalguur
path of exile settlers of kalguur kingsmarch lore
path of exile lore affliction wildwood azmeri
path of exile lore necropolis ancestor karui
path of exile lore sanctum lycia
path of exile lore heist
path of exile lore primordial gods
path of exile lore innocence sin
path of exile lore keepers of the flame
path of exile lore secrets of the atlas
path of exile 2 lore explained
path of exile 2 act 1 lore count geonor
path of exile 2 act 2 lore jamanra
path of exile 2 act 3 lore doryani utzaal
path of exile 2 act 4 lore
path of exile 2 twilight order lore
path of exile 2 edicts lore oriath
path of exile 2 interlude lore
path of exile 2 endgame lore arbiter of ash
path of exile 2 abyss lore kulemak
poe2 lore timeline
path of exile entire lore timeline precursors
Q

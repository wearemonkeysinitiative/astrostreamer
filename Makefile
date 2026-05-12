live:
	/snap/bin/gphoto2 --capture-movie --stdout | \
	ffmpeg -i - -vf format=yuv420p -c:v libx264 -preset ultrafast -tune zerolatency \
	-f rtsp rtsp://127.0.0.1:8554/canon
reload_claude:
	npm install -g @anthropic-ai/claude-code@2.1.36
run:
    pnpm run dev
update:
    pnpm update
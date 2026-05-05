live:
	/snap/bin/gphoto2 --capture-movie --stdout | \
	ffmpeg -i - -vf format=yuv420p -c:v libx264 -preset ultrafast -tune zerolatency \
	-f rtsp rtsp://127.0.0.1:8554/canon

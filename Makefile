live:
	/snap/bin/gphoto2 --capture-movie --stdout | \
	ffmpeg -i - -vf format=yuv420p -c:v libx264 -preset ultrafast -tune zerolatency \
	-f rtsp rtsp://127.0.0.1:8554/canon

run:
	pnpm run dev

dev:
	MOCK_CAMERA=true pnpm run dev

dev-infra:
	docker compose -f docker-compose.dev.yml up -d

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

logs-camera:
	docker compose logs -f camera

logs-app:
	docker compose logs -f app

update:
	pnpm update

reload_claude:
	npm install -g @anthropic-ai/claude-code@2.1.36

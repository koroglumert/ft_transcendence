#docker buildx create --use
cd ./backend
docker buildx build --platform linux/amd64,linux/arm64 -t mertkoroglu/finpong:backend . --push
cd ../frontend
docker buildx build --platform linux/amd64,linux/arm64 -t mertkoroglu/finpong:frontend . --push
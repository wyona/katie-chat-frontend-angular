# Katie Chat Frontend ("Yulup") based on Angular

## Run locally

* Edit src/environments/environment.ts
* ng serve --configuration development --proxy-config proxy.conf.json

## Build docker image (IMPORTANT: See env/docker/build/nginx.conf re backend configuration)

* rm -r dist
* npm install
* npm run build
* docker build -t yulup -f env/docker/build/Dockerfile .
* cd env/docker/run
* docker-compose up -d
* docker-compose logs -f
* http://localhost:8077

## Deploy docker image

* docker tag yulup wyona/private:yulup-frontend_1.11.0
* docker login -u USERNAME -p PASSWORD docker.io && docker push wyona/private:yulup-frontend_1.11.0
* Login to remote server
* Update docker-compose.yml
* security -v unlock-keychain ~/Library/Keychains/login.keychain-db
* docker-compose down
* docker-compose up -d
* https://chat.yulup.com

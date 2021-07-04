FROM node:5

RUN npm install -g grunt-cli yarn

ADD soy2jslinux /usr/bin/soy2js

WORKDIR /site/src/

CMD echo '{ "allow_root": true }' > .bowerrc; ./build.sh

FROM node:10-alpine
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN apk add --update python krb5 krb5-libs gcc make g++ krb5-dev
RUN mkdir -p /build

COPY package.json build/package.json

WORKDIR /build

RUN npm install

COPY . /build

CMD npm start
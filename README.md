# node-web-alert
##### Containerized node application for scraping webpages and reporting visual changes to Slack or Discord

## requirements
requires node 16.x, docker, and yarn

## environment
copy `.env-template` to `.env` and set variables before building

## configuration
set configuration in `./config/index.js`

## docker

#### `yarn build`
builds node-web-alert

#### `yarn push <registry>`
builds multi-arch and pushes node-web-alert to a docker registry

#### `yarn start`
runs node-web-alert

#### `yarn stop`
stops node-web-alert and removes the container

#### `yarn attach`
attaches to the node-web-alert terminal, `ctrl-p ctrl-q` to detach

## development

#### `yarn prod`
starts node-web-alert locally

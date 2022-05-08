# Floor Watcher
Nodejs App to watch a floor price and warn if it exceeds your threshold.
Quite useful if using looksrare to get rewards on listings.

# Requirements
1. install nodejs
2. run ```npm install```
3. create a Discord channel, insert credentials in .env File

# How to run
## Develop
node -r esm .\index.js

## Production
sudo pm2 start .\index.js

## debug/log
sudo pm2 list
sudo pm2 logs 0 --lines 1000

## .env File
### create a .env file in the root with the following content and change to your credentials:
```
DISCORD_WEBHOOK=
DISCORD_CHANNELID=idxxx
DISCORD_TOKEN=tokenxxx
```
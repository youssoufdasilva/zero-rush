#!/bin/bash

echo ""
SH_NAME="「DOCKER ENTRYPOINT 」"

echo "$SH_NAME -- Script --"

function start_app {
    cd /app || exit

    echo "$SH_NAME Starting the application"
    echo "$SH_NAME -=-=- -=-=- -=-=- -=-=- -=-=-"

    # PORT=3001 npm run dev
    # PORT=3001 npm run build && PORT=3001 npm run start

    npm install
    # npm ci
    # PORT=43002 npm run build
    PORT=43002 npm run start
    
    # Stay open
    # tail -f /dev/null
}

start_app

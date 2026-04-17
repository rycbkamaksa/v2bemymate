#!/usr/bin/bash

export DB_URL=mongodb://${DB_USER}:${DB_PASS}@localhost:27017/
node ./js/downloadMails.js

#!/usr/bin/bash

echo "You are about to drop db, continue? (type 'yes' to proceed)"

read -r AGREEMENT

if [ "$AGREEMENT" == "yes" ]; then
  export DB_URL=mongodb://${DB_USER}:${DB_PASS}@localhost:27017/
  node ./js/dropDB.js
else
  echo "Interrupt operation"
fi

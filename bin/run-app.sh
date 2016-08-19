#!/usr/bin/env bash

# source venv/bin/activate
# gunicorn -w 2 --preload -b 127.0.0.1:8005 run:app --log-level=DEBUG --timeout=120
echo 'Running app...'
exec /var/www/lile/venv/bin/gunicorn run:app -c /var/www/lile/conf/gunicorn.conf.py

bind = '127.0.0.1:8005'
accesslog = '/var/www/lile/logs/gunicorn-access.log'
errorlog = '/var/www/lile/logs/gunicorn-error.log'
limit_request_line = 0
workers = 2
preload = True
timeout = 120

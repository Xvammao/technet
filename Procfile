web: cd technet && python manage.py migrate --noinput && gunicorn technet.wsgi --log-file - --bind 0.0.0.0:$PORT

# Use official Python runtime as base image
FROM python:3.11.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV MISE_PYTHON_GITHUB_ATTESTATIONS=false

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Collect static files (non-interactive, don't fail if it errors)
RUN python manage.py collectstatic --noinput 2>/dev/null || true

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Running database migrations..."\n\
python manage.py migrate --noinput\n\
echo "Starting Gunicorn server..."\n\
exec gunicorn technet.wsgi --log-file - --bind 0.0.0.0:${PORT:-8000}' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Use shell form to allow variable expansion
CMD ["/bin/sh", "-c", "python manage.py migrate --noinput && gunicorn technet.wsgi --log-file - --bind 0.0.0.0:${PORT:-8000}"]

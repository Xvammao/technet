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

# Create staticfiles directory
RUN mkdir -p /app/staticfiles

# NOTE: collectstatic is intentionally NOT run at build time. It needs SECRET_KEY /
# DATABASE_URL, which Railway only injects at runtime (not during the Docker build),
# so running it here used to fail silently (errors were hidden by "2>/dev/null || true")
# and no static files were ever collected. It now runs at container startup instead,
# where the real environment variables are available. Do not add "|| true" back here -
# if this step fails, the deploy logs will actually show why.

# Run collectstatic, migrations and start server using shell to expand PORT variable
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["python manage.py collectstatic --noinput && python manage.py migrate --noinput && gunicorn technet.wsgi --log-file - --bind 0.0.0.0:${PORT:-8000}"]

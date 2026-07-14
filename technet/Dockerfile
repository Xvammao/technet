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

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Run migrations and start server
CMD ["gunicorn", "technet.wsgi", "--log-file", "-", "--bind", "0.0.0.0:${PORT:-8000}"]

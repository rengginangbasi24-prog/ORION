FROM python:3.11.8-slim

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Verify models are present (helps with debugging deployment issues)
RUN echo "Checking for models..." && \
    if [ -d models ]; then \
        ls -lh models/ || echo "⚠️ models/ directory exists but is empty"; \
    else \
        echo "⚠️ WARNING: models/ directory not found!"; \
    fi && \
    echo "✅ Build complete"

EXPOSE 5000

CMD ["python", "app.py"]

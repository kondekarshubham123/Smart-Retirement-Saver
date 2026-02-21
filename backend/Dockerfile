# docker build -t blk-hacking-ind-shubham-kondekar .
FROM python:3.11-slim
# OS: Debian-based for security, stability, and small size
WORKDIR /app
COPY ./app /app/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5477
CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:5477"]

from celery import Celery
from app.config.settings import get_settings

settings = get_settings()

celery = Celery(
    'blackrock',
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=['app.tasks.calculations']
)
celery.conf.update(task_track_started=True)

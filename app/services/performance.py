from app.models.performance import PerformanceResponse
import time
import threading
import psutil

def get_performance_report() -> PerformanceResponse:
    # Example implementation
    process = psutil.Process()
    mem = process.memory_info().rss / 1024 / 1024
    threads = process.num_threads()
    return PerformanceResponse(
        time=time.strftime("%H:%M:%S.%f")[:-3],
        memory=f"{mem:.2f} MB",
        threads=threads
    )

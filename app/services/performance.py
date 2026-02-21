from app.models.performance import PerformanceResponse
from datetime import datetime
import time
import threading
import psutil

def get_performance_report() -> PerformanceResponse:
    process = psutil.Process()
    # Memory in MB, formatted to 2 decimal places as a string
    mem = process.memory_info().rss / 1024 / 1024
    threads = process.num_threads()
    
    # Time formatted as YYYY-MM-DD HH:MM:SS.mmm
    current_time = datetime.now()
    time_str = current_time.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    
    return PerformanceResponse(
        time=time_str,
        memory=f"{mem:.2f}",
        threads=threads
    )

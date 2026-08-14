from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class LogLevel(str, Enum):
  INFO = 'INFO'
  WARNING = 'WARNING'
  ERROR = 'ERROR'
  DEBUG = 'DEBUG'

class LogModel(BaseModel):
  timestamp: datetime
  level: LogLevel = LogLevel['INFO']
  message: str
  service: str


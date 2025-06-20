from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Query
from google.cloud import logging_v2
from datetime import datetime, timedelta
import os

app = FastAPI()

client = logging_v2.Client()


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

class CodeInput(BaseModel):
    prompt: str

@app.post('/generate')
async def generate_code(data: CodeInput):
    try:
        result = subprocess.run(
            ['ollama', 'run', 'deepseek-coder'],
            input=data.prompt.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=60
        )
        output = result.stdout.decode().strip()
        return{'output': output}
    except Exception as e:
        return{'error': str(e)}
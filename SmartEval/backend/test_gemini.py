import os
import json
from dotenv import load_dotenv
load_dotenv('.env')
from google import genai
from google.genai import types

client = genai.Client()
file_path = 'uploads\\8be82575-1714-425d-a579-4f975dae03d0.png'
with open(file_path, 'rb') as f:
    file_bytes = f.read()

prompt = 'Return a JSON array like [{"question_number": "1", "awarded_marks": 5.0}]'

try:
    print('Sending...')
    response = client.models.generate_content(
        model='gemini-1.5-pro',
        contents=[types.Part.from_bytes(data=file_bytes, mime_type='image/png'), prompt],
        config=types.GenerateContentConfig(response_mime_type='application/json')
    )
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()

from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Hello"
    )
    print("Success:", response.text)
except Exception as e:
    print("Error:", str(e))

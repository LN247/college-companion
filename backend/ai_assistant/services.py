import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def get_ai_response(prompt, context=""):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if available
            messages=[
                {"role": "system", "content": "You are a helpful college advisor assistant."},
                {"role": "user", "content": f"{context}\n\n{prompt}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

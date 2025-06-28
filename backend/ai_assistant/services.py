
import openai
from django.conf import settings
from django.contrib.auth import  get_user_model


User= get_user_model()
openai.api_key = settings.OPENAI_API_KEY


def get_personalized_response(user, prompt):
    try:

        profile = user.Userprofile

        # Create context string
        context = f"""
        You are a college advisor assistant specialized in {profile.major} and {profile.minor}studies.
        The student  want to be guided on and have resources Expert recommendation and guidance on {profile.major}or {profile.minor}.
        Provide specific advice and resources relevant to their field of study.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=50
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating response: {str(e)}"
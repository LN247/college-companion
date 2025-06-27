
import openai
from django.conf import settings


openai.api_key = settings.OPENAI_API_KEY


def get_personalized_response(user, prompt):
    try:
        # Get user profile (assuming OneToOne relationship)
        profile = user.userprofile

        # Create context string
        context = f"""
        You are a college advisor assistant specialized in {profile.major} studies.
        The student is a {profile.year} year {profile.major} major.
        Provide specific advice and resources relevant to their field of study.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating response: {str(e)}"
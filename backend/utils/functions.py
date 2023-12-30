from django.template.loader import render_to_string
from django.core.mail import EmailMessage
import os
from dotenv import load_dotenv
load_dotenv()


# email sending function
def send_email(user_email, context=None, user_name=None, uid=None, token=None, template_name=None, subject=None):
    to_email = user_email
    context = context
    html_message = render_to_string(template_name, context)
    email = EmailMessage(
        subject=subject,
        body=html_message,
        from_email=os.getenv('user'),
        to=[to_email],
    )
    email.content_subtype = 'html'
    email.send()

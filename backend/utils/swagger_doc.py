from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

update_user_swagger = swagger_auto_schema(
    operation_description="Update user information",
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request'),
    }
)

get_user_me_swagger = swagger_auto_schema(
    responses={
        200: openapi.Response(
            'Success',
            openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                    'full_name': openapi.Schema(type=openapi.TYPE_STRING, description='Full name of the user'),
                    'total_amount': openapi.Schema(type=openapi.TYPE_NUMBER,
                                                   description='Total amount of money for the user'),
                }
            )
        ),
        404: openapi.Response('Not Found')
    },
    operation_description="Get logged-in user information"
)

forget_password_swagger = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email'],
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
        }
    ),
    operation_description="Forget Password",
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request'),
        404: openapi.Response('Not Found'),
        500: openapi.Response('Internal Server Error'),
    }
)

reset_password_swagger = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['password',
                  'password_confirm'],
        properties={
            'password': openapi.Schema(type=openapi.TYPE_STRING),
            'password_confirm': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    operation_description="Reset Password",
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request'),
        404: openapi.Response('Not Found'),
        500: openapi.Response('Internal Server Error'),
    }
)

update_password_swagger = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['old_password', 'new_password', 'new_password_repeat'],
        properties={
            'old_password': openapi.Schema(type=openapi.TYPE_STRING),
            'new_password': openapi.Schema(type=openapi.TYPE_STRING),
            'new_password_repeat': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    responses={200: 'Password updated successfully',
               400: 'Bad Request'},
    operation_description="Update a user's password"
)

register_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['email', 'password', 'full_name'],
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
        'full_name': openapi.Schema(type=openapi.TYPE_STRING, description='Full name'),
    }
)

register_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'status': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Status of the operation'),
        'message': openapi.Schema(type=openapi.TYPE_OBJECT, description='Message, including user data on success'),
    }
)

register_swagger = swagger_auto_schema(
    operation_description="Register a new user",
    request_body=register_request_schema,
    responses={
        201: register_response_schema,
        400: 'Bad Request',
    },
)

verify_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'status': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Status of the verification'),
        'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message confirming email verification'),
    }
)

verify_swagger = swagger_auto_schema(
    operation_description="Verify a user's email address",
    responses={
        200: verify_response_schema,
    },
    manual_parameters=[
        openapi.Parameter('token', openapi.IN_PATH,
                          description="User's token for verification",
                          type=openapi.TYPE_STRING),
    ]
)

many_delete_swagger = swagger_auto_schema(
    operation_description="Multiple deletions",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
        },
        required=['ids'],
    ),
    responses={204: 'No Content'},
)

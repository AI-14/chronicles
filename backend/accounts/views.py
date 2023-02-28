from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import UserSerializer


User = get_user_model()


class SignupView(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request: Request) -> Response:
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
            return Response(data={'message': 'User created successfully', 'user': user_serializer.data}, status=status.HTTP_201_CREATED)

        return Response(data={'message': user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UsersListView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request: Request) -> Response:
        all_users = User.objects.all()
        total_count = User.objects.count()
        user_serializer = UserSerializer(instance=all_users, many=True)
        return Response(data={'total_count': total_count, 'users': user_serializer.data}, status=status.HTTP_200_OK)


class UserDetailView(APIView):

    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        try:
            user = User.objects.get(pk=request.user.id)
            user_serializer = UserSerializer(instance=user)
            return Response(data=user_serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request: Request) -> Response:
        try:
            user = User.objects.get(pk=request.user.id)
            user_serializer = UserSerializer(
                instance=user, data=request.data, partial=True)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
                return Response(data={'message': f'User credentials updated successfully', 'user': user_serializer.data}, status=status.HTTP_200_OK)

            return Response(data={'message': user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(data={'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request: Request) -> Response:
        try:
            user = User.objects.get(pk=request.user.id)
            User.objects.get(pk=request.user.id).blog_posts.all().delete()
            user.delete()

            return Response(data={'message': f'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

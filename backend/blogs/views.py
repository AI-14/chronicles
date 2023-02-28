import uuid

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Applaud, Blog, Comment, ReadingList
from .pagination import CustomPageNumberPagination
from .serializers import (ApplaudSerializer, BlogSerializer, CommentSerializer,
                          ReadingListSerializer)


# ------------------------------ Blog views ------------------------------
class AllBlogsListView(APIView):

    def get(self, request: Request) -> Response:
        category: str = request.query_params.get('category', None)

        if category:
            blogs = Blog.objects.filter(status='publish', category=category)
        else:
            blogs = Blog.objects.filter(status='publish')

        total = blogs.count()
        paginator = CustomPageNumberPagination()
        return paginator.generate_response(blogs, BlogSerializer, request, total)


class SearchBlogView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        search_term: str = request.query_params.get('title', None)

        if not search_term:
            return Response(data={'message': 'query_param "title" is not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        filtered_blogs = Blog.objects.filter(title__icontains=search_term)
        blog_serializer = BlogSerializer(instance=filtered_blogs, many=True)
        return Response(data=blog_serializer.data, status=status.HTTP_200_OK)
    

class BlogPostView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request: Request) -> Response:
        data = request.data.copy()
        data['author'] = str(request.user.id)

        blog_serializer = BlogSerializer(data=data)
        if blog_serializer.is_valid(raise_exception=True):
            blog_serializer.save()
            return Response(data={'message': 'Blog created successfully', 'blog': blog_serializer.data}, status=status.HTTP_201_CREATED)

        return Response(data={'message': blog_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserBlogsListView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        blog_status = request.query_params.get('status', None)

        if not blog_status:
            return Response(data={'message': 'Query param `status` is not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if blog_status == 'draft':
            blogs = Blog.objects.filter(
                author=request.user.id, status=blog_status)
        elif blog_status == 'publish':
            blogs = Blog.objects.filter(
                author=request.user.id, status=blog_status)

        blog_serializer = BlogSerializer(instance=blogs, many=True)
        return Response(data=blog_serializer.data, status=status.HTTP_200_OK)


class BlogDetailView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            blog_serializer = BlogSerializer(instance=blog)
            return Response(data=blog_serializer.data, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)

            if blog.author.id != request.user.id:
                return Response(data={'message': 'You are unauthorized to update the requested blog'}, status=status.HTTP_401_UNAUTHORIZED)

            blog_serializer = BlogSerializer(
                instance=blog, data=request.data, partial=True)
            if blog_serializer.is_valid(raise_exception=True):
                blog_serializer.save()
                return Response(data={'message': 'Blog updated successfully', 'blog': blog_serializer.data}, status=status.HTTP_200_OK)

            return Response(data=blog_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)

            if blog.author.id != request.user.id:
                return Response(data={'message': 'You are unauthorized to delete the requested blog'}, status=status.HTTP_401_UNAUTHORIZED)

            blog.delete()
            return Response(data={'message': 'Blog deleted successfully'}, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)


# ------------------------------ Comment views ------------------------------
class CommentsListView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, blog_id: uuid) -> Response:
        comments = Comment.objects.filter(blog=blog_id)
        comment_serializer = CommentSerializer(instance=comments, many=True)
        return Response(data=comment_serializer.data, status=status.HTTP_200_OK)


class CommentsAggregateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, blog_id: uuid) -> Response:
        total = Comment.objects.filter(blog=blog_id).count()
        return Response(data={'total': total}, status=status.HTTP_200_OK)
    

class CommentPostView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            
            data = {}
            data['blog'] = str(blog_id)
            data['user'] = str(request.user.id)
            data['content'] = request.data

            comment_serializer = CommentSerializer(data=data)
            if comment_serializer.is_valid(raise_exception=True):
                comment_serializer.save()
                return Response(data={'message': 'Comment posted successfully', 'comment': comment_serializer.data}, status=status.HTTP_201_CREATED)

            return Response(data=comment_serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)


class CommentDetailView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, blog_id: uuid, comment_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            comment = Comment.objects.get(pk=comment_id)

            if request.user.id != comment.user.id:
                return Response(data={'message': 'You are unauthorized to update the requested comment'}, status=status.HTTP_401_UNAUTHORIZED)

            comment_serializer = CommentSerializer(
                instance=comment, data=request.data, partial=True)
            if comment_serializer.is_valid(raise_exception=True):
                comment_serializer.save()
                return Response(data={'message': 'Comment updated successfully'}, status=status.HTTP_200_OK)

            return Response(data=comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (Blog.DoesNotExist, Comment.DoesNotExist) as e:
            if isinstance(e, Blog.DoesNotExist):
                return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(data={'message': 'Comment does not exist'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request: Request, blog_id: uuid, comment_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            comment = Comment.objects.get(pk=comment_id)
            comment.delete()
            return Response(data={'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
        except (Blog.DoesNotExist, Comment.DoesNotExist) as e:
            if isinstance(e, Blog.DoesNotExist):
                return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(data={'message': 'Comment does not exist'}, status=status.HTTP_404_NOT_FOUND)


# ------------------------------ Applaud views ------------------------------
class ApplaudPostView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            user_applauded = Applaud.objects.filter(
                blog=blog_id, user=request.user.id).exists()
            if user_applauded:
                blog.applaud_count -= 1
                Applaud.objects.filter(
                    blog=blog_id, user=request.user.id).delete()
            else:
                blog.applaud_count += 1
                data = {
                    'blog': blog_id,
                    'user': request.user.id
                }

                applaud_serializer = ApplaudSerializer(data=data)
                if applaud_serializer.is_valid(raise_exception=True):
                    applaud_serializer.save()

            blog.save()
            blog_serializer = BlogSerializer(instance=blog)
            return Response(data=blog_serializer.data, status=status.HTTP_200_OK)

        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)


class ApplaudDetailView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, blog_id: uuid) -> Response:
        if Applaud.objects.filter(blog=blog_id, user=request.user.id).exists():
            return Response(data={'message': 'true'}, status=status.HTTP_200_OK)

        return Response(data={'message': 'false'}, status=status.HTTP_200_OK)


# ------------------------------ Reading-list related views ------------------------------
class ReadingListPostView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, blog_id: uuid) -> Response:
        try:
            blog = Blog.objects.get(pk=blog_id)
            user_saved = ReadingList.objects.filter(
                blog=blog_id, user=request.user.id).exists()
            if user_saved:
                ReadingList.objects.filter(
                    blog=blog_id, user=request.user.id).delete()
                return Response(data={'message': 'Blog removed from the reading-list successfully'}, status=status.HTTP_200_OK)
            else:
                data = {
                    'blog': blog_id,
                    'user': request.user.id
                }

                reading_list_serializer = ReadingListSerializer(data=data)
                if reading_list_serializer.is_valid(raise_exception=True):
                    reading_list_serializer.save()

                return Response(data={'message': 'Blog added to the reading-list successfully'}, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)


class ReadingListDetailView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, blog_id: uuid) -> Response:
        if ReadingList.objects.filter(blog=blog_id, user=request.user.id).exists():
            return Response(data={'message': 'true'}, status=status.HTTP_200_OK)

        return Response(data={'message': 'false'}, status=status.HTTP_200_OK)


class ReadingListListView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        try:
            user = get_user_model().objects.get(pk=request.user.id)
            reading_list = ReadingList.objects.filter(user=request.user.id)
            reading_list_serializer = ReadingListSerializer(
                reading_list, many=True)
            return Response(data=reading_list_serializer.data, status=status.HTTP_200_OK)

        except get_user_model().DoesNotExist:
            return Response(data={'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

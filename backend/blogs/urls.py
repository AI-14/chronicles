from django.urls import path

from .views import (AllBlogsListView, ApplaudDetailView, ApplaudPostView,
                    BlogDetailView, BlogPostView, CommentDetailView,
                    CommentPostView, CommentsAggregateView, CommentsListView,
                    ReadingListDetailView, ReadingListListView,
                    ReadingListPostView, SearchBlogView, UserBlogsListView)


urlpatterns = [
    # Blog urls
    path('all/', AllBlogsListView.as_view(), name='all_blogs'),
    path('blogpost/', BlogPostView.as_view(), name='post_a_blog'),
    path('blog/<uuid:blog_id>/', BlogDetailView.as_view(), name='blog_detail'),
    path('userblogs/', UserBlogsListView.as_view(), name='blogs_of_user'),
    path('search/', SearchBlogView.as_view(), name='search_a_blog'),
    
    # Blog comment urls
    path('blog/<uuid:blog_id>/comments/all/',
         CommentsListView.as_view(), name='all_comments_of_a_blog'),
    path('blog/<uuid:blog_id>/totalcomments/',
         CommentsAggregateView.as_view(), name='total_comments_of_a_blog'),
    path('blog/<uuid:blog_id>/commentpost/',
         CommentPostView.as_view(), name='post_a_comment'),
    path('blog/<uuid:blog_id>/comment/<uuid:comment_id>/',
         CommentDetailView.as_view(), name='comment_detail'),

    # Applaud urls
    path('blog/<uuid:blog_id>/applaud/',
         ApplaudPostView.as_view(), name='applaud_a_blog'),
    path('blog/<uuid:blog_id>/applauder/exists/',
         ApplaudDetailView.as_view(), name='applauder_exists'),

    # Reading-list urls
    path('blog/<uuid:blog_id>/readinglist/save/',
         ReadingListPostView.as_view(), name='add_to_reading_list'),
    path('readinglist/all/', ReadingListListView.as_view(), name='all_reading_list'),
    path('blog/<uuid:blog_id>/reader/exists/',
         ReadingListDetailView.as_view(), name='reader_exists')
]

from rest_framework.serializers import CharField, ImageField, SlugField, RelatedField, ModelSerializer

from .models import Applaud, Blog, Comment, ReadingList


class BlogSerializer(ModelSerializer):

    author_username = CharField(source='author.username', read_only=True)
    author_profile_image = ImageField(
        source='author.profile_image', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'slug', 'subtitle', 'cover_image', 'content', 'category', 'created_at',
                  'status', 'applaud_count', 'author', 'author_username', 'author_profile_image']

    def update(self, instance, validated_data):
        # Allowed update fields are: [title, subtitle, cover_image, content, category, status]

        for key, data in validated_data.items():
            if key == 'cover_image':
                instance.cover_image.delete(save=False)
            setattr(instance, key, data)

        instance.save()

        return instance


class CommentSerializer(ModelSerializer):

    user_username = CharField(source='user.username', read_only=True)
    user_profile_image = ImageField(
        source='user.profile_image', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'blog',
                  'user', 'user_username', 'user_profile_image']


class ApplaudSerializer(ModelSerializer):

    class Meta:
        model = Applaud
        fields = '__all__'


class ReadingListSerializer(ModelSerializer):
    blog_details = BlogSerializer(source='blog', read_only=True)

    class Meta:
        model = ReadingList
        fields = ['blog', 'user', 'blog_details']

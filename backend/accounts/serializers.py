from django.contrib.auth import get_user_model
from rest_framework.serializers import (CharField, ModelSerializer,
                                        ValidationError)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserSerializer(ModelSerializer):

    password = CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email',
                  'password', 'profile_image', 'date_joined']

    def validate(self, data):
        password = data.get('password', None)

        if password and (len(password) < 6 or len(password) > 12):
            raise ValidationError(
                {'password': 'Password must be in between 6 to 12 characters (inclusive)'})

        return data

    def create(self, validated_data):
        email: str = validated_data.pop('email')
        password: str = validated_data.pop('password')

        return UserSerializer.Meta.model.objects.create_user(email, password, **validated_data)

    def update(self, instance, validated_data):
        # Allowed update fields are: [username, email, password, profile_image]

        for key, data in validated_data.items():
            if key == 'profile_image':
                instance.profile_image.delete(save=False)
            if key == 'password':
                instance.set_password(data)
                continue
            setattr(instance, key, data)

        instance.save()

        return instance

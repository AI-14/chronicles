from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import MyTokenObtainPairView
from .views import SignupView, UserDetailView, UsersListView


urlpatterns = [
    path('all/', UsersListView.as_view(), name='all_users'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('user/signup/', SignupView.as_view(), name='user_signup'),
    path('user/login/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/login/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
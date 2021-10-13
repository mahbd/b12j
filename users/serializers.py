from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, \
    UserCreatePasswordRetypeSerializer as BaseUserCreatePasswordRetypeSerializer
from rest_framework import serializers


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')


class UserCreatePasswordRetypeSerializer(BaseUserCreatePasswordRetypeSerializer, UserCreateSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["re_password"] = serializers.CharField(
            style={"input_type": "password"}
        )

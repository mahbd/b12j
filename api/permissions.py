from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class HasContestOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in [*SAFE_METHODS, 'PUT', 'PATCH'] or
                    (request.user and request.user.is_staff))

    def has_object_permission(self, request, view, obj, safe_deny=False):
        related_users = [user.id for user in obj.writers.all()]
        if request.method in ['PUT', 'PATCH'] or safe_deny:
            return bool(request.user and (request.user.is_staff or request.user.id in related_users))
        if request.method in SAFE_METHODS:
            return True
        return False


class IsOwnerOrReadOnly(permissions.IsAuthenticatedOrReadOnly):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(request.method in SAFE_METHODS or
                    user and ((obj.user and obj.user.id == user.id) or user.is_staff))


class UserModelPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if type(obj) == type(user) and obj == user:
            return True
        return request.method in SAFE_METHODS or user.is_staff


class IsPermittedAddContest(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in [*permissions.SAFE_METHODS, 'PUT', 'DELETE'] or request.user.is_staff:
            return True
        return False

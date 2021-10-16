from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class IsPermittedEditContest(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in [*permissions.SAFE_METHODS, 'POST']:
            return True
        if not request.user.is_active:
            return False
        if request.user.is_staff or \
                request.user.id in [user.id for user in (list(obj.writers.all()) + list(obj.testers.all()))]:
            return True
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.method in SAFE_METHODS or
                    request.user and
                    (obj.user_id == request.user.id or request.user.is_staff))


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

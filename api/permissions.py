from rest_framework import permissions


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


class IsPermittedAddContest(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in [*permissions.SAFE_METHODS, 'PUT', 'DELETE'] or request.user.is_staff:
            return True
        return False

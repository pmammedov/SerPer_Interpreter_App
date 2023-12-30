from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    The request is authenticated as an admin (status 1 or 2), or is a read-only request.
    """

    def has_permission(self, request, view):
        # SAFE_METHODS (GET, HEAD, OPTIONS gibi) için herkese izin ver.
        if request.method in SAFE_METHODS:
            return True

        # Kullanıcı giriş yapmış mı ve status 1 (Admin) veya 2 (Süper Admin) mi kontrol et.
        return request.user and request.user.status in [1, 2]


class IsAdminOrPostOnly(BasePermission):
    """
    The request is authenticated as an admin (status 1 or 2) for any request,
    except for POST and safe methods (GET, HEAD, OPTIONS)
    which are allowed for any user.
    """

    def has_permission(self, request, view):
        # POST veya SAFE_METHODS için herkese izin ver.
        if request.method == 'POST' or request.method in SAFE_METHODS:
            return True

        # Kullanıcı giriş yapmış mı ve status 1 (Admin) veya 2 (Süper Admin) mi kontrol et.
        return request.user and request.user.status in [1, 2]


class IsSuperAdminUser(BasePermission):
    """
    Permission allowed only users with a status value of 2 and is_superuser set to True
    """

    def has_permission(self, request, view):
        user = request.user
        return user and user.is_superuser and user.status == 2


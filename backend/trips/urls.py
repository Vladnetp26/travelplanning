from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TripViewSet, ItineraryItemViewSet, ExpenseViewSet,
    PackingItemViewSet, BookingViewSet, parse_booking_email
)

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')
router.register(r'itinerary', ItineraryItemViewSet, basename='itinerary')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'packing', PackingItemViewSet, basename='packing')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('parse-booking-email/', parse_booking_email, name='parse_booking_email'),
]

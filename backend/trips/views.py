from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Trip, ItineraryItem, Expense, PackingItem, Booking
from .serializers import (
    TripSerializer, TripListSerializer, ItineraryItemSerializer,
    ExpenseSerializer, PackingItemSerializer, BookingSerializer
)


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ItineraryItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryItemSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ItineraryItem.objects.filter(trip__user=self.request.user)

    def perform_create(self, serializer):
        trip = get_object_or_404(Trip, id=self.request.data.get('trip'), user=self.request.user)
        serializer.save(trip=trip)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Expense.objects.filter(trip__user=self.request.user)

    def perform_create(self, serializer):
        trip = get_object_or_404(Trip, id=self.request.data.get('trip'), user=self.request.user)
        serializer.save(trip=trip)


class PackingItemViewSet(viewsets.ModelViewSet):
    serializer_class = PackingItemSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return PackingItem.objects.filter(trip__user=self.request.user)

    def perform_create(self, serializer):
        trip = get_object_or_404(Trip, id=self.request.data.get('trip'), user=self.request.user)
        serializer.save(trip=trip)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(trip__user=self.request.user)

    def perform_create(self, serializer):
        trip = get_object_or_404(Trip, id=self.request.data.get('trip'), user=self.request.user)
        serializer.save(trip=trip)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def parse_booking_email(request):
    """Заглушка для парсинга email с подтверждением бронирования."""
    email_text = request.data.get('email_text', '')
    trip_id = request.data.get('trip')

    trip = get_object_or_404(Trip, id=trip_id, user=request.user)

    booking = Booking.objects.create(
        trip=trip,
        booking_type='flight',
        title='Спаршенный рейс (заглушка)',
        confirmation_number='PARSER-DEMO-123',
        email_source=email_text,
        is_parsed=True,
    )

    return Response({
        'message': 'Письмо получено. Полная интеграция требует подключения почтового сервиса.',
        'booking': BookingSerializer(booking).data
    })

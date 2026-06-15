from rest_framework import serializers
from .models import Trip, ItineraryItem, Expense, PackingItem, Booking


class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = '__all__'
        read_only_fields = ('trip',)


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('trip',)


class PackingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackingItem
        fields = '__all__'
        read_only_fields = ('trip',)


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('trip',)


class TripSerializer(serializers.ModelSerializer):
    itinerary_items = ItineraryItemSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    packing_items = PackingItemSerializer(many=True, read_only=True)
    bookings = BookingSerializer(many=True, read_only=True)
    total_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('user',)

    def get_total_expenses(self, obj):
        return sum(expense.amount for expense in obj.expenses.all())


class TripListSerializer(serializers.ModelSerializer):
    total_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = ('id', 'title', 'destination', 'start_date', 'end_date', 'status', 'budget', 'total_expenses', 'cover_image')

    def get_total_expenses(self, obj):
        return sum(expense.amount for expense in obj.expenses.all())

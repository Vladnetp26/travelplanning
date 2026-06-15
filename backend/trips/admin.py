from django.contrib import admin
from .models import Trip, ItineraryItem, Expense, PackingItem, Booking


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'destination', 'start_date', 'end_date', 'status')
    list_filter = ('status',)
    search_fields = ('title', 'destination')


@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'trip', 'date', 'time')


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'trip', 'amount', 'category', 'date')
    list_filter = ('category',)


@admin.register(PackingItem)
class PackingItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'trip', 'is_packed')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('title', 'trip', 'booking_type', 'confirmation_number', 'start_date')
    list_filter = ('booking_type',)

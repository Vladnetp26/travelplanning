from django.db import models
from django.contrib.auth.models import User


class Trip(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Запланирована'),
        ('active', 'Активна'),
        ('completed', 'Завершена'),
        ('cancelled', 'Отменена'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=200, verbose_name='Название поездки')
    description = models.TextField(blank=True, verbose_name='Описание')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    destination = models.CharField(max_length=200, verbose_name='Основное направление')
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Бюджет')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned', verbose_name='Статус')
    cover_image = models.ImageField(upload_to='trips/', blank=True, null=True, verbose_name='Обложка')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Поездка'
        verbose_name_plural = 'Поездки'

    def __str__(self):
        return self.title


class ItineraryItem(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='itinerary_items')
    date = models.DateField(verbose_name='Дата')
    time = models.TimeField(blank=True, null=True, verbose_name='Время')
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    location = models.CharField(max_length=200, blank=True, verbose_name='Место')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        ordering = ['date', 'time', 'order']
        verbose_name = 'Пункт маршрута'
        verbose_name_plural = 'Пункты маршрута'

    def __str__(self):
        return f"{self.title} ({self.date})"


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('transport', 'Транспорт'),
        ('housing', 'Жильё'),
        ('food', 'Еда'),
        ('entertainment', 'Развлечения'),
        ('shopping', 'Покупки'),
        ('other', 'Другое'),
    ]

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=200, verbose_name='Название')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other', verbose_name='Категория')
    date = models.DateField(verbose_name='Дата')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Расход'
        verbose_name_plural = 'Расходы'

    def __str__(self):
        return f"{self.title}: {self.amount}"


class PackingItem(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='packing_items')
    name = models.CharField(max_length=200, verbose_name='Название')
    is_packed = models.BooleanField(default=False, verbose_name='Упаковано')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Вещь в чемодан'
        verbose_name_plural = 'Вещи в чемодане'

    def __str__(self):
        return self.name


class Booking(models.Model):
    BOOKING_TYPES = [
        ('flight', 'Авиабилет'),
        ('hotel', 'Отель'),
        ('train', 'Ж/Д'),
        ('car', 'Аренда авто'),
        ('other', 'Другое'),
    ]

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='bookings')
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPES, verbose_name='Тип бронирования')
    title = models.CharField(max_length=200, verbose_name='Название')
    confirmation_number = models.CharField(max_length=100, blank=True, verbose_name='Номер подтверждения')
    start_date = models.DateTimeField(blank=True, null=True, verbose_name='Начало')
    end_date = models.DateTimeField(blank=True, null=True, verbose_name='Окончание')
    location = models.CharField(max_length=200, blank=True, verbose_name='Место')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Стоимость')
    email_source = models.TextField(blank=True, verbose_name='Исходное письмо')
    is_parsed = models.BooleanField(default=False, verbose_name='Спарсено из письма')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'

    def __str__(self):
        return f"{self.title} ({self.get_booking_type_display()})"

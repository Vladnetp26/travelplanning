from django.db import models
from django.contrib.auth.models import User


class UserSettings(models.Model):
    LANGUAGE_CHOICES = [
        ('ru', 'Русский'),
        ('en', 'English'),
    ]

    THEME_CHOICES = [
        ('light', 'Светлая'),
        ('dark', 'Тёмная'),
    ]

    CURRENCY_CHOICES = [
        ('RUB', '₽ Российский рубль'),
        ('USD', '$ Доллар США'),
        ('EUR', '€ Евро'),
        ('GBP', '£ Британский фунт'),
        ('JPY', '¥ Японская йена'),
    ]

    DISTANCE_CHOICES = [
        ('km', 'Километры'),
        ('mi', 'Мили'),
    ]

    TEMPERATURE_CHOICES = [
        ('C', '°C'),
        ('F', '°F'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='ru', verbose_name='Язык')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light', verbose_name='Тема')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='RUB', verbose_name='Валюта')
    distance_unit = models.CharField(max_length=2, choices=DISTANCE_CHOICES, default='km', verbose_name='Единица расстояния')
    temperature_unit = models.CharField(max_length=1, choices=TEMPERATURE_CHOICES, default='C', verbose_name='Единица температуры')
    email_notifications = models.BooleanField(default=True, verbose_name='Email-уведомления')
    push_notifications = models.BooleanField(default=True, verbose_name='Push-уведомления')
    google_maps_api_key = models.CharField(max_length=255, blank=True, verbose_name='Google Maps API ключ')
    google_calendar_connected = models.BooleanField(default=False, verbose_name='Google Calendar подключён')
    apple_calendar_connected = models.BooleanField(default=False, verbose_name='Apple Calendar подключён')

    class Meta:
        verbose_name = 'Настройки пользователя'
        verbose_name_plural = 'Настройки пользователей'

    def __str__(self):
        return f"Настройки {self.user.username}"

# راهنمای نصب و تنظیم Nginx با SSL

## مرحله 1: نصب Nginx و Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

## مرحله 2: کپی فایل تنظیمات Nginx

```bash
# کپی فایل تنظیمات
sudo cp /var/www/techsolutionsutrecht/nginx/techsolutionsutrecht.nl.conf /etc/nginx/sites-available/

# ایجاد لینک نمادین
sudo ln -s /etc/nginx/sites-available/techsolutionsutrecht.nl.conf /etc/nginx/sites-enabled/

# حذف سایت پیش‌فرض
sudo rm -f /etc/nginx/sites-enabled/default
```

## مرحله 3: ویرایش فایل تنظیمات برای SSL موقت

قبل از دریافت گواهی SSL، باید خطوط SSL را موقتاً کامنت کنیم:

```bash
sudo nano /etc/nginx/sites-available/techsolutionsutrecht.nl.conf
```

کامنت کردن بخش HTTPS (خطوط 16 تا 76):
- خطوط مربوط به `listen 443` و تمام تنظیمات SSL را موقتاً غیرفعال کنید
- یا فقط بخش HTTP (خطوط 1-14) را نگه دارید

## مرحله 4: تست و راه‌اندازی Nginx

```bash
# تست تنظیمات
sudo nginx -t

# راه‌اندازی مجدد
sudo systemctl restart nginx
sudo systemctl enable nginx

# بررسی وضعیت
sudo systemctl status nginx
```

## مرحله 5: دریافت گواهی SSL

**مهم:** مطمئن شوید DNS دامنه به سرور شما اشاره دارد!

```bash
# دریافت گواهی SSL
sudo certbot --nginx -d techsolutionsutrecht.nl -d www.techsolutionsutrecht.nl

# در صورت نیاز به حذف --nginx و استفاده از standalone:
# sudo systemctl stop nginx
# sudo certbot certonly --standalone -d techsolutionsutrecht.nl -d www.techsolutionsutrecht.nl
# sudo systemctl start nginx
```

## مرحله 6: فعال‌سازی تنظیمات کامل HTTPS

بعد از دریافت گواهی:

```bash
# بازگرداندن تنظیمات کامل
sudo cp /var/www/techsolutionsutrecht/nginx/techsolutionsutrecht.nl.conf /etc/nginx/sites-available/

# تست
sudo nginx -t

# راه‌اندازی مجدد
sudo systemctl restart nginx
```

## مرحله 7: تست سایت

```bash
# بررسی HTTP (باید به HTTPS ریدایرکت شود)
curl -I http://techsolutionsutrecht.nl

# بررسی HTTPS
curl -I https://techsolutionsutrecht.nl
```

سایت شما در دسترس است:
- https://techsolutionsutrecht.nl
- https://www.techsolutionsutrecht.nl

## تمدید خودکار SSL

Certbot به صورت خودکار تمدید می‌شود. برای تست:

```bash
sudo certbot renew --dry-run
```

## دستورات مفید

```bash
# بررسی لاگ‌های Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx

# بررسی وضعیت
sudo systemctl status nginx

# بررسی گواهی‌های SSL
sudo certbot certificates

# تمدید دستی
sudo certbot renew
```

## عیب‌یابی

### اگر Nginx شروع نشد:
```bash
sudo nginx -t
sudo journalctl -u nginx -f
```

### اگر SSL کار نکرد:
```bash
sudo certbot certificates
sudo systemctl restart nginx
```

### بررسی Firewall:
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

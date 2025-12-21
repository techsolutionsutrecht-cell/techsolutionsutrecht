# Tech Solutions Utrecht - راهنمای دیپلوی

## پیش‌نیازها

1. سرور Hetzner با IP: `91.99.49.208`
2. دامنه: `techsolutionsutrecht.nl` (DNS باید به IP سرور اشاره کند)
3. دسترسی SSH به سرور
4. حساب GitHub

## مراحل راه‌اندازی اولیه سرور

### ۱. اتصال به سرور

```bash
ssh root@91.99.49.208
```

### ۲. اجرای اسکریپت راه‌اندازی سرور

ابتدا ریپازیتوری را به صورت دستی کلون کنید:

```bash
# ایجاد دایرکتوری پروژه
mkdir -p /var/www/techsolutionsutrecht.nl
cd /var/www/techsolutionsutrecht.nl

# کلون کردن ریپازیتوری (آدرس خود را جایگزین کنید)
git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git .
```

سپس اسکریپت راه‌اندازی را اجرا کنید:

```bash
chmod +x scripts/setup-server.sh
bash scripts/setup-server.sh
```

### ۳. تنظیم متغیرهای محیطی

فایل `.env.production` را ایجاد کنید:

```bash
cd /var/www/techsolutionsutrecht.nl
cp .env.production.example .env.production
nano .env.production
```

مقادیر زیر را تنظیم کنید:

```env
DATABASE_URL="postgresql://admin:رمز_عبور_قوی@postgres:5432/tech_hub"
POSTGRES_USER=admin
POSTGRES_PASSWORD=رمز_عبور_قوی_دیتابیس
POSTGRES_DB=tech_hub

NEXTAUTH_SECRET=یک_رشته_رندوم_حداقل_32_کاراکتر
NEXTAUTH_URL=https://techsolutionsutrecht.nl

RESEND_API_KEY=کلید_API_ایمیل_شما

NODE_ENV=production
```

برای تولید `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### ۴. راه‌اندازی SSL

```bash
certbot --nginx -d techsolutionsutrecht.nl -d www.techsolutionsutrecht.nl
```

### ۵. دیپلوی اولیه

```bash
chmod +x scripts/deploy.sh
bash scripts/deploy.sh
```

## راه‌اندازی GitHub Actions

### ۱. تنظیم SSH Key

روی سرور:

```bash
# اگر کلید SSH ندارید، بسازید
ssh-keygen -t ed25519 -C "github-actions"

# محتوای کلید خصوصی را کپی کنید
cat ~/.ssh/id_ed25519
```

### ۲. تنظیم GitHub Secrets

به مسیر زیر بروید:
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

سه Secret زیر را اضافه کنید:

- **SERVER_HOST**: `91.99.49.208`
- **SERVER_USER**: `root` (یا نام کاربری SSH شما)
- **SSH_PRIVATE_KEY**: محتوای کامل فایل `~/.ssh/id_ed25519`

### ۳. فعال‌سازی دیپلوی خودکار

پس از push به branch `main` یا `master`، GitHub Actions به صورت خودکار:
- کد را روی سرور pull می‌کند
- Docker containers را rebuild می‌کند
- Migration های دیتابیس را اجرا می‌کند
- سرویس را restart می‌کند

## مدیریت سرور

### مشاهده لاگ‌ها

```bash
cd /var/www/techsolutionsutrecht.nl
docker compose -f docker-compose.production.yml logs -f app
```

### Restart کردن سرویس

```bash
cd /var/www/techsolutionsutrecht.nl
docker compose -f docker-compose.production.yml restart
```

### بررسی وضعیت Containers

```bash
docker compose -f docker-compose.production.yml ps
```

### دیپلوی دستی

```bash
cd /var/www/techsolutionsutrecht.nl
bash scripts/deploy.sh
```

### بکاپ دیتابیس

```bash
docker compose -f docker-compose.production.yml exec postgres pg_dump -U admin tech_hub > backup_$(date +%Y%m%d).sql
```

### بازیابی دیتابیس

```bash
cat backup_20241222.sql | docker compose -f docker-compose.production.yml exec -T postgres psql -U admin tech_hub
```

## حل مشکلات متداول

### پورت 3000 اشغال است

در این پروژه از پورت **3007** استفاده می‌شود که در `docker-compose.production.yml` تعریف شده است.

### دیتابیس اجرا نمی‌شود

```bash
# ایجاد volume دیتابیس
docker volume create postgres_data

# Restart کردن سرویس
cd /var/www/techsolutionsutrecht.nl
docker compose -f docker-compose.production.yml up -d
```

### SSL تمدید نمی‌شود

```bash
certbot renew --dry-run
```

### فضای دیسک کم است

```bash
# پاک کردن Docker resources استفاده نشده
docker system prune -a

# پاک کردن volumes استفاده نشده (احتیاط!)
docker volume prune
```

## نکات امنیتی

1. ✅ همیشه از رمز عبور قوی برای دیتابیس استفاده کنید
2. ✅ فایل `.env.production` را هرگز commit نکنید
3. ✅ فایروال سرور را تنظیم کنید (UFW)
4. ✅ به صورت منظم از دیتابیس backup بگیرید
5. ✅ به صورت دوره‌ای سیستم را آپدیت کنید

## پورت‌های مورد استفاده

- **80**: HTTP (Nginx)
- **443**: HTTPS (Nginx)
- **3007**: Next.js Application
- **5432**: PostgreSQL (فقط درون Docker network)

## لینک‌های مفید

- وب‌سایت: https://techsolutionsutrecht.nl
- پنل ادمین: https://techsolutionsutrecht.nl/admin/dashboard
- GitHub Actions: [Your Repo] → Actions

---

**تاریخ ایجاد**: ۲۲ دسامبر ۲۰۲۵

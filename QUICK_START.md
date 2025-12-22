# راهنمای سریع Deploy

## مشکل قبلی
پروژه روی local کار می‌کرد ولی روی سرور نمی‌تونستی project بسازی چون:
- ✅ **حل شد**: سیستم فایل در Docker volume ذخیره نمی‌شد
- ✅ **حل شد**: Dockerfile نبود
- ✅ **حل شد**: اتصال به دیتابیس اشتباه بود

## دستورات سریع برای Deploy

### گزینه 1: استفاده از اسکریپت خودکار (پیشنهادی)

```bash
# 1. فایل .env.production رو ویرایش کن
cp .env.production.example .env.production
nano .env.production  # اطلاعات database رو وارد کن

# 2. اجرای اسکریپت deploy
./deploy.sh 91.99.49.208
```

### گزینه 2: Deploy دستی

```bash
# 1. آماده‌سازی فایل environment
cp .env.production.example .env.production
nano .env.production

# 2. انتقال فایل‌ها به سرور
rsync -avz --exclude 'node_modules' --exclude '.next' ./ root@91.99.49.208:/var/www/tech-hub/

# 3. اجرا روی سرور
ssh root@91.99.49.208
cd /var/www/tech-hub
docker compose -f docker-compose.prod.yml up -d --build

# 4. اجرای migrations
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

## بررسی وضعیت

```bash
# اتصال به سرور
ssh root@91.99.49.208

# وضعیت containers
cd /var/www/tech-hub
docker compose -f docker-compose.prod.yml ps

# مشاهده logs
docker compose -f docker-compose.prod.yml logs -f app

# تست database connection
docker compose -f docker-compose.prod.yml exec app npx prisma db pull
```

## رفع مشکل "نمیتونم project بسازم"

این مشکل معمولاً به این دلایل هست:

### 1. مشکل Permissions
```bash
docker compose -f docker-compose.prod.yml exec app ls -la /app/public/uploads
# باید ownership nextjs:nodejs باشه
```

### 2. مشکل Database Connection
```bash
docker compose -f docker-compose.prod.yml logs postgres
docker compose -f docker-compose.prod.yml exec app printenv | grep DATABASE
```

### 3. مشکل در Migrations
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec app npx prisma generate
```

### 4. مشکل در Build
```bash
# Rebuild کامل
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```

## تست کامل

بعد از deploy، این مراحل رو تست کن:

1. ✅ **صفحه اصلی**: http://91.99.49.208:3000
2. ✅ **Admin Dashboard**: http://91.99.49.208:3000/admin/dashboard
3. ✅ **ساخت Project جدید**: http://91.99.49.208:3000/admin/projects/create
4. ✅ **آپلود عکس**: سعی کن یک پروژه با عکس بسازی
5. ✅ **بعد از Restart**: `docker compose restart app` و باز هم پروژه‌ها رو ببین

## پورت‌ها

- **3000**: Next.js Application
- **5432**: PostgreSQL Database

اگر میخوای از طریق domain دسترسی داشته باشی، باید Nginx نصب کنی (راهنماش تو DEPLOYMENT.md هست).

## کمک بیشتر

اگر هنوز مشکل داری:
1. Logs رو بگیر: `docker compose -f docker-compose.prod.yml logs -f app`
2. Error message رو بفرست
3. یا اینکه من مستقیماً به سرور وصل میشم و چک می‌کنم

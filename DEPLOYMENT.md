# دستورالعمل Deploy کردن پروژه

## مشکلات قبلی که حل شد:
1. ✅ سیستم آپلود فایل حالا از volume استفاده می‌کنه
2. ✅ Dockerfile برای Next.js ساخته شد
3. ✅ docker-compose.prod.yml برای production آماده شد
4. ✅ اتصال به database در Docker درست شد

## مراحل Deploy روی سرور:

### 1. آماده‌سازی سرور (قبل از اینکه کد رو بفرستی)

```bash
# اتصال به سرور
ssh root@91.99.49.208

# نصب Docker (اگر نصب نیست)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# نصب Docker Compose
apt-get update
apt-get install docker-compose-plugin -y

# ساخت پوشه پروژه
mkdir -p /var/www/tech-hub
cd /var/www/tech-hub
```

### 2. انتقال کد به سرور

از کامپیوتر لوکال خودت:

```bash
# ابتدا فایل .env.production رو بساز
cp .env.production.example .env.production

# ویرایش .env.production و اطلاعات database رو وارد کن
# سپس کد رو به سرور بفرست (از Git یا rsync)

# با Git:
git push origin main

# یا با rsync:
rsync -avz --exclude 'node_modules' --exclude '.next' ./ root@91.99.49.208:/var/www/tech-hub/
```

### 3. اجرا روی سرور

```bash
# اتصال به سرور
ssh root@91.99.49.208
cd /var/www/tech-hub

# کپی کردن environment variables
cp .env.production.example .env.production
nano .env.production  # ویرایش و وارد کردن اطلاعات واقعی

# ساخت و اجرای containers
docker compose -f docker-compose.prod.yml up -d --build

# بررسی وضعیت
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

### 4. اجرای Migration های Prisma

```bash
# اگر اولین باره:
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# بررسی database
docker compose -f docker-compose.prod.yml exec app npx prisma studio
```

### 5. مشاهده Logs برای Debug

```bash
# لاگ‌های app
docker compose -f docker-compose.prod.yml logs -f app

# لاگ‌های postgres
docker compose -f docker-compose.prod.yml logs -f postgres

# وضعیت containers
docker compose -f docker-compose.prod.yml ps
```

## دستورات مفید

```bash
# Restart کردن application
docker compose -f docker-compose.prod.yml restart app

# پاک کردن و rebuild کامل
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# ورود به container برای debug
docker compose -f docker-compose.prod.yml exec app sh

# بررسی فضای disk
docker system df
docker system prune -a  # پاک کردن فایل‌های اضافی

# Backup کردن database
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U your_user tech_hub > backup.sql

# Restore کردن database
docker compose -f docker-compose.prod.yml exec -T postgres psql -U your_user tech_hub < backup.sql
```

## رفع مشکلات متداول

### مشکل: "Cannot create project"
```bash
# بررسی permissions پوشه uploads
docker compose -f docker-compose.prod.yml exec app ls -la /app/public/uploads

# بررسی logs
docker compose -f docker-compose.prod.yml logs -f app
```

### مشکل: "Database connection failed"
```bash
# بررسی وضعیت postgres
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# بررسی environment variables
docker compose -f docker-compose.prod.yml exec app printenv | grep DATABASE
```

### مشکل: "Out of memory"
```bash
# بررسی استفاده از memory
docker stats

# افزایش memory limit (در docker-compose.prod.yml):
# services:
#   app:
#     deploy:
#       resources:
#         limits:
#           memory: 1G
```

## Setup Nginx (اختیاری - برای production با domain)

```bash
# نصب Nginx
apt-get install nginx -y

# ساخت config file
nano /etc/nginx/sites-available/tech-hub
```

محتوای config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# فعال‌سازی config
ln -s /etc/nginx/sites-available/tech-hub /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# نصب SSL با Certbot
apt-get install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com
```

## یادداشت‌های مهم

1. **File Uploads**: تمام فایل‌های آپلود شده در volume `uploads_data` ذخیره می‌شن و با restart از بین نمیرن
2. **Database**: دیتابیس در volume `postgres_data` ذخیره میشه
3. **Environment Variables**: همیشه `.env.production` رو با اطلاعات واقعی پر کن
4. **Security**: پسورد دیتابیس رو قوی انتخاب کن و از default استفاده نکن

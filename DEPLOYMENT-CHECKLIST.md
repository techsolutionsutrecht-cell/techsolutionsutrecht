# ✅ Checklist دیپلوی - Tech Solutions Utrecht

## قبل از شروع

- [ ] DNS دامنه `techsolutionsutrecht.nl` به IP `91.99.49.208` اشاره می‌کند
- [ ] دسترسی SSH به سرور Hetzner دارید
- [ ] ریپازیتوری GitHub ایجاد شده است
- [ ] کلید API برای Resend دارید (برای ارسال ایمیل)

## مرحله ۱: آماده‌سازی کد

- [ ] کد را در GitHub push کنید:
  ```bash
  git add .
  git commit -m "Setup deployment configuration"
  git push origin main
  ```

## مرحله ۲: راه‌اندازی سرور

- [ ] به سرور متصل شوید:
  ```bash
  ssh root@91.99.49.208
  ```

- [ ] پروژه قبلی را پاک یا rename کنید (اگر لازم است):
  ```bash
  # Backup کردن پروژه قبلی
  mv /var/www/techsolutionsutrecht.nl /var/www/techsolutionsutrecht.nl.backup
  ```

- [ ] ریپازیتوری را کلون کنید:
  ```bash
  mkdir -p /var/www/techsolutionsutrecht.nl
  cd /var/www/techsolutionsutrecht.nl
  git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
  ```
  > یا با SSH:
  ```bash
  git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git .
  ```

- [ ] اسکریپت راه‌اندازی را اجرا کنید:
  ```bash
  chmod +x scripts/*.sh
  bash scripts/setup-server.sh
  ```

## مرحله ۳: تنظیم Environment Variables

- [ ] فایل `.env.production` را ایجاد کنید:
  ```bash
  cd /var/www/techsolutionsutrecht.nl
  cp .env.production.example .env.production
  nano .env.production
  ```

- [ ] مقادیر زیر را تنظیم کنید:
  - [ ] `POSTGRES_PASSWORD` - یک رمز عبور قوی
  - [ ] `NEXTAUTH_SECRET` - تولید با: `openssl rand -base64 32`
  - [ ] `NEXTAUTH_URL` - باید `https://techsolutionsutrecht.nl` باشد
  - [ ] `RESEND_API_KEY` - کلید API ایمیل

## مرحله ۴: راه‌اندازی Nginx و SSL

- [ ] Nginx configuration را کپی کنید:
  ```bash
  cp nginx/techsolutionsutrecht.nl.conf /etc/nginx/sites-available/techsolutionsutrecht.nl
  ln -sf /etc/nginx/sites-available/techsolutionsutrecht.nl /etc/nginx/sites-enabled/
  nginx -t
  systemctl reload nginx
  ```

- [ ] SSL را راه‌اندازی کنید:
  ```bash
  certbot --nginx -d techsolutionsutrecht.nl -d www.techsolutionsutrecht.nl
  ```

## مرحله ۵: دیپلوی اولیه

- [ ] Docker volume را ایجاد کنید:
  ```bash
  docker volume create postgres_data
  ```

- [ ] اولین دیپلوی را انجام دهید:
  ```bash
  bash scripts/deploy.sh
  ```

- [ ] وضعیت را بررسی کنید:
  ```bash
  bash scripts/status.sh
  ```

## مرحله ۶: تنظیم GitHub Actions

- [ ] SSH Key را تولید کنید (اگر ندارید):
  ```bash
  ssh-keygen -t ed25519 -C "github-actions"
  cat ~/.ssh/id_ed25519  # کپی کنید
  ```

- [ ] به Settings ریپازیتوری در GitHub بروید
- [ ] به `Secrets and variables` → `Actions` بروید
- [ ] سه Secret زیر را اضافه کنید:
  - [ ] `SERVER_HOST` = `91.99.49.208`
  - [ ] `SERVER_USER` = `root` (یا username SSH شما)
  - [ ] `SSH_PRIVATE_KEY` = محتوای کامل `~/.ssh/id_ed25519`

## مرحله ۷: تست

- [ ] سایت را در مرورگر باز کنید: https://techsolutionsutrecht.nl
- [ ] پنل ادمین را تست کنید: https://techsolutionsutrecht.nl/admin/dashboard
- [ ] یک تغییر کوچک در کد ایجاد کنید و push کنید
- [ ] GitHub Actions را بررسی کنید (زیر تب Actions)
- [ ] بعد از deploy خودکار، سایت را دوباره بررسی کنید

## مرحله ۸: امنیت (اختیاری اما توصیه می‌شود)

- [ ] فایروال را راه‌اندازی کنید:
  ```bash
  ufw allow OpenSSH
  ufw allow 'Nginx Full'
  ufw enable
  ```

- [ ] SSH را ایمن‌تر کنید:
  ```bash
  nano /etc/ssh/sshd_config
  # تنظیمات پیشنهادی:
  # PermitRootLogin no
  # PasswordAuthentication no
  systemctl restart sshd
  ```

- [ ] یک کاربر غیر root ایجاد کنید:
  ```bash
  adduser deployuser
  usermod -aG sudo deployuser
  usermod -aG docker deployuser
  ```

## بررسی نهایی

- [ ] ✅ سایت روی HTTPS کار می‌کند
- [ ] ✅ پورت 3007 درست استفاده می‌شود (نه 3000)
- [ ] ✅ دیتابیس متصل است
- [ ] ✅ GitHub Actions کار می‌کند
- [ ] ✅ SSL certificate معتبر است
- [ ] ✅ تمام صفحات load می‌شوند

## دستورات مفید

```bash
# مشاهده logs
docker compose -f docker-compose.production.yml logs -f app

# Restart
docker compose -f docker-compose.production.yml restart

# دیپلوی دستی
bash scripts/deploy.sh

# وضعیت سرور
bash scripts/status.sh

# بکاپ دیتابیس
docker compose -f docker-compose.production.yml exec postgres pg_dump -U admin tech_hub > backup.sql
```

## در صورت مشکل

1. Logs را چک کنید:
   ```bash
   docker compose -f docker-compose.production.yml logs app
   journalctl -u nginx -n 50
   ```

2. Containers را restart کنید:
   ```bash
   docker compose -f docker-compose.production.yml restart
   ```

3. در صورت نیاز، rebuild کنید:
   ```bash
   docker compose -f docker-compose.production.yml up -d --build
   ```

---

✨ **موفق باشید!**

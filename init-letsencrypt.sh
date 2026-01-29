#!/bin/bash

# Let's Encrypt 初期設定スクリプト
# 使用方法: ./init-letsencrypt.sh <IPアドレス> <メールアドレス>

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <IP_ADDRESS> <EMAIL>"
    echo "Example: $0 203.0.113.50 your@email.com"
    exit 1
fi

IP_ADDRESS=$1
EMAIL=$2
CERT_PATH="./certbot/conf/live/cert"

echo "==> Creating required directories..."
mkdir -p ./certbot/conf ./certbot/www

# 初回起動用のダミー証明書を作成（nginxが起動できるように）
if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo "==> Creating dummy certificate for nginx..."
    mkdir -p "$CERT_PATH"
    openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
        -keyout "$CERT_PATH/privkey.pem" \
        -out "$CERT_PATH/fullchain.pem" \
        -subj "/CN=localhost"
fi

echo "==> Starting nginx..."
docker compose up -d nginx

echo "==> Requesting Let's Encrypt certificate for IP: $IP_ADDRESS..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d "$IP_ADDRESS" \
    --cert-name cert

echo "==> Reloading nginx..."
docker compose exec nginx nginx -s reload

echo "==> Done! Certificate installed for $IP_ADDRESS"
echo "==> Access: https://$IP_ADDRESS:3001"

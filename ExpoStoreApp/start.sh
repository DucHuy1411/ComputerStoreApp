#!/bin/bash

# Script Quick Start cho ExpoStoreApp

echo "🚀 ExpoStoreApp - Quick Start"
echo "================================"
echo ""

# Kiểm tra xem đã cài dependencies chưa
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt dependencies..."
    npm install
    echo ""
fi

# Kiểm tra và cập nhật API URL
echo "🔧 Kiểm tra cấu hình API..."
if [ -f "services/api.js" ]; then
    CURRENT_URL=$(grep -oP 'export const API_BASE_URL = "\K[^"]+' services/api.js)
    echo "   API URL hiện tại: $CURRENT_URL"
    
    # Lấy IP hiện tại
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")
    
    if [ -n "$IP" ]; then
        EXPECTED_URL="http://$IP:3001"
        if [ "$CURRENT_URL" != "$EXPECTED_URL" ]; then
            echo "⚠️  IP hiện tại: $IP"
            echo "   Bạn có muốn cập nhật API URL thành $EXPECTED_URL? (y/n)"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                node update-api-url.js "$IP"
            fi
        fi
    fi
fi

echo ""
echo "✅ Đang khởi động Expo..."
echo ""
echo "📱 Lưu ý:"
echo "   - Đảm bảo Backend API đang chạy tại port 3001"
echo "   - Quét QR code bằng Expo Go app trên điện thoại"
echo "   - Hoặc nhấn 'i' (iOS) / 'a' (Android) để mở simulator"
echo ""

npm start



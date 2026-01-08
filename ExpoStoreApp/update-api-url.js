#!/usr/bin/env node

/**
 * Script helper để cập nhật API_BASE_URL trong services/api.js
 * 
 * Cách dùng:
 *   node update-api-url.js                    # Tự động lấy IP hiện tại
 *   node update-api-url.js 192.168.1.100     # Dùng IP cụ thể
 *   node update-api-url.js localhost          # Dùng localhost
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_FILE = path.join(__dirname, 'services', 'api.js');

function getLocalIP() {
  try {
    // Thử macOS/Linux
    const ip = execSync('ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null', { encoding: 'utf8' }).trim();
    if (ip) return ip;
  } catch (e) {
    // Thử cách khác
    try {
      const output = execSync('ifconfig | grep "inet " | grep -v 127.0.0.1', { encoding: 'utf8' });
      const match = output.match(/inet (\d+\.\d+\.\d+\.\d+)/);
      if (match) return match[1];
    } catch (e2) {
      console.error('Không thể tự động lấy IP. Vui lòng nhập IP thủ công.');
      return null;
    }
  }
  return null;
}

function updateAPIUrl(newIP) {
  if (!fs.existsSync(API_FILE)) {
    console.error(`❌ Không tìm thấy file: ${API_FILE}`);
    process.exit(1);
  }

  let content = fs.readFileSync(API_FILE, 'utf8');
  
  // Tìm và thay thế API_BASE_URL
  const regex = /export const API_BASE_URL = ["']([^"']+)["'];?/;
  const match = content.match(regex);
  
  if (!match) {
    console.error('❌ Không tìm thấy API_BASE_URL trong file');
    process.exit(1);
  }

  const oldURL = match[1];
  const newURL = `http://${newIP}:3001`;
  
  content = content.replace(regex, `export const API_BASE_URL = "${newURL}";`);
  
  fs.writeFileSync(API_FILE, content, 'utf8');
  
  console.log('✅ Đã cập nhật API URL:');
  console.log(`   Cũ: ${oldURL}`);
  console.log(`   Mới: ${newURL}`);
}

// Main
const args = process.argv.slice(2);
let ip = args[0];

if (!ip) {
  console.log('🔍 Đang tìm IP address của máy...');
  ip = getLocalIP();
  
  if (!ip) {
    console.error('❌ Không thể tự động lấy IP. Vui lòng chạy:');
    console.error('   node update-api-url.js YOUR_IP_ADDRESS');
    process.exit(1);
  }
  
  console.log(`📱 Tìm thấy IP: ${ip}`);
}

updateAPIUrl(ip);



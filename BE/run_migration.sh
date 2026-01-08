#!/bin/bash

# Script to run database migration for adding payment fields to orders table

echo "🔍 Checking MySQL connection..."

# Check if MySQL is running
if ! pgrep mysqld > /dev/null; then
  echo "❌ MySQL is not running. Please start MySQL first."
  echo "   Run: brew services start mysql"
  exit 1
fi

echo "✅ MySQL is running"

# Check if database exists
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'techstore';" 2>/dev/null | grep -c techstore)

if [ "$DB_EXISTS" -eq 0 ]; then
  echo "❌ Database 'techstore' does not exist."
  echo "   Please create it first or run the techstore.sql file."
  exit 1
fi

echo "✅ Database 'techstore' exists"

# Check if columns already exist
echo ""
echo "🔍 Checking if columns already exist..."

PAYMENT_METHOD_EXISTS=$(mysql -u root techstore -e "SHOW COLUMNS FROM orders LIKE 'paymentMethod';" 2>/dev/null | grep -c paymentMethod)
PAYMENT_TRANS_ID_EXISTS=$(mysql -u root techstore -e "SHOW COLUMNS FROM orders LIKE 'paymentTransactionId';" 2>/dev/null | grep -c paymentTransactionId)
MOMO_REQUEST_ID_EXISTS=$(mysql -u root techstore -e "SHOW COLUMNS FROM orders LIKE 'momoRequestId';" 2>/dev/null | grep -c momoRequestId)

if [ "$PAYMENT_METHOD_EXISTS" -gt 0 ] && [ "$PAYMENT_TRANS_ID_EXISTS" -gt 0 ] && [ "$MOMO_REQUEST_ID_EXISTS" -gt 0 ]; then
  echo "✅ All payment columns already exist. No migration needed."
  exit 0
fi

echo ""
echo "📝 Running migration..."

# Run the simple migration
mysql -u root techstore < migrations/add_payment_fields_simple.sql 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📊 Verifying columns..."
  mysql -u root techstore -e "SHOW COLUMNS FROM orders LIKE 'payment%';" 2>/dev/null
  mysql -u root techstore -e "SHOW COLUMNS FROM orders LIKE 'momo%';" 2>/dev/null
else
  echo ""
  echo "❌ Migration failed. Please check the error above."
  echo ""
  echo "💡 If columns already exist, you can ignore the error."
  exit 1
fi




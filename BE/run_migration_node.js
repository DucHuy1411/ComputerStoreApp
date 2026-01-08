// Node.js script to run database migration
// This uses Sequelize connection instead of mysql CLI

const { sequelize } = require('./app/models');

async function runMigration() {
  try {
    console.log('🔍 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('\n📝 Running migration...');
    
    // Check if columns exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'techstore' 
      AND TABLE_NAME = 'orders' 
      AND COLUMN_NAME IN ('paymentMethod', 'paymentTransactionId', 'momoRequestId')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);
    console.log('Existing columns:', existingColumns);

    if (existingColumns.includes('paymentMethod') && 
        existingColumns.includes('paymentTransactionId') && 
        existingColumns.includes('momoRequestId')) {
      console.log('\n✅ All payment columns already exist. No migration needed.');
      process.exit(0);
    }

    // Add missing columns
    const queries = [];

    if (!existingColumns.includes('paymentMethod')) {
      queries.push(`
        ALTER TABLE \`orders\` 
        ADD COLUMN \`paymentMethod\` ENUM('cod', 'momo', 'bank', 'other') DEFAULT NULL AFTER \`paymentStatus\`
      `);
    }

    if (!existingColumns.includes('paymentTransactionId')) {
      queries.push(`
        ALTER TABLE \`orders\` 
        ADD COLUMN \`paymentTransactionId\` VARCHAR(100) DEFAULT NULL AFTER \`paymentMethod\`
      `);
    }

    if (!existingColumns.includes('momoRequestId')) {
      queries.push(`
        ALTER TABLE \`orders\` 
        ADD COLUMN \`momoRequestId\` VARCHAR(100) DEFAULT NULL AFTER \`paymentTransactionId\`
      `);
    }

    for (const query of queries) {
      console.log(`\nExecuting: ${query.trim()}`);
      await sequelize.query(query);
    }

    console.log('\n✅ Migration completed successfully!');

    // Verify
    const [verifyResults] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'techstore' 
      AND TABLE_NAME = 'orders' 
      AND COLUMN_NAME IN ('paymentMethod', 'paymentTransactionId', 'momoRequestId')
    `);
    
    console.log('\n📊 Verifying columns...');
    verifyResults.forEach(r => console.log(`  ✅ ${r.COLUMN_NAME}`));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();




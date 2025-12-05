// Quick test to verify admin user and password
// Run with: node --loader tsx-node/esm test-admin-simple.js

const bcrypt = require('bcryptjs');

console.log('\n=== ADMIN USER PASSWORD TEST ===\n');

const testPassword = 'Admin@123';
const storedHash = '$2b$10$6IgNMIOHqovQRkb3cOSNSuYLRtFvi40ULoe5i6tIXorp2rjRQ4w4K';

console.log('Testing password:', testPassword);
console.log('Against hash:', storedHash);
console.log('');

const isValid = bcrypt.compareSync(testPassword, storedHash);

if (isValid) {
    console.log('✅ PASSWORD IS VALID!');
    console.log('The hash is correct for password "Admin@123"');
} else {
    console.log('❌ PASSWORD IS INVALID!');
    console.log('The hash does NOT match the password');
}

console.log('\n=== CREATING NEW HASH ===\n');
const newHash = bcrypt.hashSync(testPassword, 10);
console.log('Freshly generated hash for "Admin@123":');
console.log(newHash);
console.log('\nUse this hash in your SQL:');
console.log(`UPDATE users SET password = '${newHash}' WHERE email = 'admin@smartleads.com';`);

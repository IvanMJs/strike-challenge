import bcrypt from 'bcryptjs';

async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

// Generate hashes for our users
generateHash('admin123').then(() => {
  generateHash('user123');
});

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import User from '../models/User.model';
import { hashPassword } from '../utils/password';
import { SEED_USERS, DEFAULT_SEED_PASSWORD, SEED_BORROWER_PROFILE } from '../constants/seed.constants';
import { SeedResult } from '../types/seed.types';

async function seedUsers(): Promise<void> {
  await connectDB();

  const results: SeedResult[] = [];

  for (const seedUser of SEED_USERS) {
    const existing = await User.findOne({ email: seedUser.email });

    const passwordHash = await hashPassword(DEFAULT_SEED_PASSWORD);

    const userData: Record<string, unknown> = {
      fullName: seedUser.fullName,
      email: seedUser.email,
      passwordHash,
      role: seedUser.role,
      isActive: true,
    };

    if (seedUser.email === SEED_BORROWER_PROFILE.email) {
      userData.pan = SEED_BORROWER_PROFILE.pan;
      userData.dob = SEED_BORROWER_PROFILE.dob;
      userData.monthlySalary = SEED_BORROWER_PROFILE.monthlySalary;
      userData.employmentMode = SEED_BORROWER_PROFILE.employmentMode;
      userData.isProfileComplete = SEED_BORROWER_PROFILE.isProfileComplete;
      userData.eligibilityStatus = SEED_BORROWER_PROFILE.eligibilityStatus;
    }

    if (existing) {
      // Always force-correct the role so that users registered via public signup get the right role
      await User.updateOne(
        { email: seedUser.email },
        { $set: { role: seedUser.role, fullName: seedUser.fullName, isActive: true, passwordHash } },
      );
      results.push({ email: seedUser.email, role: seedUser.role, status: 'existing' });
    } else {
      await User.create(userData);
      results.push({ email: seedUser.email, role: seedUser.role, status: 'created' });
    }
  }

  console.log('\nSeed Results:');
  console.log('-'.repeat(50));
  for (const result of results) {
    const label = result.status === 'created' ? 'Created' : 'Existing';
    console.log(`${label}: ${result.email} [${result.role}]`);
  }

  const created = results.filter((r) => r.status === 'created').length;
  const existing = results.filter((r) => r.status === 'existing').length;
  console.log('-'.repeat(50));
  console.log(`Total: ${created} created, ${existing} already existing`);
  console.log('');
}

seedUsers()
  .then(() => {
    console.log('Seed completed successfully.');
    return mongoose.disconnect();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    mongoose.disconnect().finally(() => {
      process.exit(1);
    });
  });

import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  // Seeding users
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    let role: Role = 'USER';
    if (account.role === 'ADMIN') {
      role = 'ADMIN';
    }
    const banned = account.banned || false; // Default to false if not provided
    console.log(`  Creating user: ${account.email} with role: ${role} and banned: ${banned}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
        banned,
      },
    });
  });

  // Seeding stuff
  config.defaultData.forEach(async (data, index) => {
    let condition: Condition = 'good';
    if (data.condition === 'poor') {
      condition = 'poor';
    } else if (data.condition === 'excellent') {
      condition = 'excellent';
    }
    console.log(`  Adding stuff: ${data.name} (${data.owner})`);
    await prisma.stuff.upsert({
      where: { id: index + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  });

  // Seeding feedback
  config.defaultFeedback.forEach(async (feedback, index) => {
    console.log(`  Adding feedback from: ${feedback.email}`);
    await prisma.feedback.upsert({
      where: { id: index + 1 },
      update: {},
      create: {
        feedbackType: feedback.feedbackType,
        firstName: feedback.firstName,
        lastName: feedback.lastName,
        email: feedback.email,
        feedback: feedback.feedback,
        isResolved: feedback.isResolved,
        createdAt: new Date(feedback.createdAt),
      },
    });
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

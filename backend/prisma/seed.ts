import { PrismaClient, CameraType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { hashAgentToken } from '../src/common/utils/token.util';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = process.env.SEED_USER_EMAIL ?? 'owner@example.com';
  const password = process.env.SEED_USER_PASSWORD ?? 'ChangeMe123!';
  const agentToken = process.env.SEED_AGENT_TOKEN ?? 'local-agent-token';
  const pepper = process.env.AGENT_TOKEN_PEPPER ?? 'change-me-too';

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Store Owner',
      email,
      passwordHash: await bcrypt.hash(password, 12),
      store: {
        create: {
          name: 'Demo Retail Store',
          address: 'Main entrance',
          timeZone: 'UTC'
        }
      }
    },
    include: { store: true }
  });

  const store = user.store ?? (await prisma.store.findUniqueOrThrow({ where: { ownerId: user.id } }));
  const camera =
    (await prisma.camera.findFirst({ where: { storeId: store.id } })) ??
    (await prisma.camera.create({
      data: {
        storeId: store.id,
        name: 'Main Entrance Camera',
        type: CameraType.WEBCAM
      }
    }));

  await prisma.aiAgent.upsert({
    where: { apiTokenHash: hashAgentToken(agentToken, pepper) },
    update: {},
    create: {
      storeId: store.id,
      cameraId: camera.id,
      name: 'Local AI Agent',
      apiTokenHash: hashAgentToken(agentToken, pepper)
    }
  });

  console.log('Seed completed.');
  console.log(`User: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Agent token: ${agentToken}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

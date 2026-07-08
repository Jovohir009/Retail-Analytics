CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "CameraType" AS ENUM ('WEBCAM', 'RTSP', 'VIDEO_FILE');
CREATE TYPE "CameraStatus" AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE "AgentStatus" AS ENUM ('ONLINE', 'OFFLINE', 'SYNCHRONIZING');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Store" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ownerId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "timeZone" TEXT NOT NULL DEFAULT 'UTC',
  "status" "StoreStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Camera" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "storeId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "type" "CameraType" NOT NULL,
  "status" "CameraStatus" NOT NULL DEFAULT 'OFFLINE',
  "lastSyncAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiAgent" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "storeId" UUID NOT NULL,
  "cameraId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "apiTokenHash" TEXT NOT NULL,
  "status" "AgentStatus" NOT NULL DEFAULT 'OFFLINE',
  "lastSeenAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiAgent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VisitorEvent" (
  "id" UUID NOT NULL,
  "storeId" UUID NOT NULL,
  "cameraId" UUID NOT NULL,
  "agentId" UUID NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "direction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VisitorEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE UNIQUE INDEX "Store_ownerId_key" ON "Store"("ownerId");
CREATE INDEX "Store_ownerId_idx" ON "Store"("ownerId");
CREATE INDEX "Camera_storeId_idx" ON "Camera"("storeId");
CREATE INDEX "Camera_status_idx" ON "Camera"("status");
CREATE UNIQUE INDEX "AiAgent_apiTokenHash_key" ON "AiAgent"("apiTokenHash");
CREATE INDEX "AiAgent_storeId_idx" ON "AiAgent"("storeId");
CREATE INDEX "AiAgent_cameraId_idx" ON "AiAgent"("cameraId");
CREATE INDEX "AiAgent_status_idx" ON "AiAgent"("status");
CREATE INDEX "VisitorEvent_storeId_occurredAt_idx" ON "VisitorEvent"("storeId", "occurredAt");
CREATE INDEX "VisitorEvent_cameraId_occurredAt_idx" ON "VisitorEvent"("cameraId", "occurredAt");
CREATE INDEX "VisitorEvent_agentId_occurredAt_idx" ON "VisitorEvent"("agentId", "occurredAt");

ALTER TABLE "Store" ADD CONSTRAINT "Store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VisitorEvent" ADD CONSTRAINT "VisitorEvent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VisitorEvent" ADD CONSTRAINT "VisitorEvent_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VisitorEvent" ADD CONSTRAINT "VisitorEvent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."DeviceKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "encryptionPublicKeyJwk" JSONB NOT NULL,
    "signingPublicKeyJwk" JSONB,
    "algorithm" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CodeShare" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "ciphertextB64u" TEXT NOT NULL,
    "ivB64u" TEXT NOT NULL,
    "aad" TEXT,
    "wrappedKeys" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeviceKey_userId_idx" ON "public"."DeviceKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceKey_userId_deviceId_key" ON "public"."DeviceKey"("userId", "deviceId");

-- CreateIndex
CREATE INDEX "CodeShare_authorId_idx" ON "public"."CodeShare"("authorId");

-- CreateIndex
CREATE INDEX "CodeShare_createdAt_idx" ON "public"."CodeShare"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."DeviceKey" ADD CONSTRAINT "DeviceKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CodeShare" ADD CONSTRAINT "CodeShare_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

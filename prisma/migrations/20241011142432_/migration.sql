-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "TransactionRuleType" AS ENUM ('STOP', 'SELL');

-- CreateTable
CREATE TABLE "Informator" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "liquidity" DECIMAL(65,30),
    "payload" JSONB,
    "snapshotChainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnapshotChain" (
    "id" TEXT NOT NULL,
    "informatorId" TEXT NOT NULL,
    "assetAddress" TEXT NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnapshotChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'ONGOING',
    "assetAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyTransaction" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellTransaction" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "transactionRuleId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAutoTrade" BOOLEAN NOT NULL DEFAULT false,
    "login" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionRule" (
    "id" TEXT NOT NULL,
    "priceChange" DECIMAL(65,30) NOT NULL,
    "transactionVolume" DECIMAL(65,30),
    "type" "TransactionRuleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformatorRate" (
    "id" TEXT NOT NULL,
    "successes" SERIAL NOT NULL,
    "fales" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformatorRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRate" (
    "id" TEXT NOT NULL,
    "successes" SERIAL NOT NULL,
    "fales" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToInformator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Informator_userName_key" ON "Informator"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Informator_telegramId_key" ON "Informator"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotChain_informatorId_assetAddress_createdAt_key" ON "SnapshotChain"("informatorId", "assetAddress", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BuyTransaction_tradeId_key" ON "BuyTransaction"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_telegramId_key" ON "Chat"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToInformator_AB_unique" ON "_ChatToInformator"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToInformator_B_index" ON "_ChatToInformator"("B");

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_snapshotChainId_fkey" FOREIGN KEY ("snapshotChainId") REFERENCES "SnapshotChain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotChain" ADD CONSTRAINT "SnapshotChain_informatorId_fkey" FOREIGN KEY ("informatorId") REFERENCES "Informator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotChain" ADD CONSTRAINT "SnapshotChain_assetAddress_fkey" FOREIGN KEY ("assetAddress") REFERENCES "Asset"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_assetAddress_fkey" FOREIGN KEY ("assetAddress") REFERENCES "Asset"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyTransaction" ADD CONSTRAINT "BuyTransaction_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyTransaction" ADD CONSTRAINT "BuyTransaction_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellTransaction" ADD CONSTRAINT "SellTransaction_transactionRuleId_fkey" FOREIGN KEY ("transactionRuleId") REFERENCES "TransactionRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellTransaction" ADD CONSTRAINT "SellTransaction_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellTransaction" ADD CONSTRAINT "SellTransaction_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformatorRate" ADD CONSTRAINT "InformatorRate_id_fkey" FOREIGN KEY ("id") REFERENCES "Informator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRate" ADD CONSTRAINT "ChatRate_id_fkey" FOREIGN KEY ("id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToInformator" ADD CONSTRAINT "_ChatToInformator_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToInformator" ADD CONSTRAINT "_ChatToInformator_B_fkey" FOREIGN KEY ("B") REFERENCES "Informator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  const receipts = await prisma.receipt.count();
  const onlinePayments = await prisma.onlinePayment.count();
  const deposits = await prisma.deposit.count();
  const admissions = await prisma.admission.count();
  
  console.log(`DB Counts:`);
  console.log(`Receipts: ${receipts}`);
  console.log(`OnlinePayments: ${onlinePayments}`);
  console.log(`Deposits: ${deposits}`);
  console.log(`Admissions: ${admissions}`);
}

main().finally(() => prisma.$disconnect());

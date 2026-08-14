import { PrismaClient, PaymentMode } from '@prisma/client';



const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Fee Collection data...');

  const school = await prisma.school.findFirst();
  if (!school) {
    console.error('No school found in DB. Run base seed first.');
    return;
  }

  // Get admissions with student + program for realistic data
  const admissions = await prisma.admission.findMany({
    where: { schoolId: school.id, status: 'ACTIVE', deletedAt: null },
    include: {
      student: { select: { firstName: true, lastName: true } },
      program: { select: { name: true } },
    },
    take: 40,
  });

  if (admissions.length === 0) {
    console.error('No admissions found. Run seed-more.ts first.');
    return;
  }

  console.log(`Found ${admissions.length} admissions to generate data for.`);

  const banks = [
    { name: 'State Bank of India', branch: 'Yavatmal Main' },
    { name: 'HDFC Bank', branch: 'Arni Branch' },
    { name: 'ICICI Bank', branch: 'Yavatmal City' },
    { name: 'Bank of Baroda', branch: 'Arni Road' },
    { name: 'Punjab National Bank', branch: 'Yavatmal' },
    { name: 'Axis Bank', branch: 'Market Yard' },
  ];

  let receiptCounter = await prisma.receipt.count();
  let depositCounter = await prisma.deposit.count();

  // ═══════════════════════════════════════════════════════════
  // 1. CASH RECEIPTS — for Convert Cash to Cheque / Online
  // ═══════════════════════════════════════════════════════════
  console.log('Creating CASH receipts...');
  const cashReceiptIds: string[] = [];

  for (let i = 0; i < Math.min(admissions.length, 15); i++) {
    const adm = admissions[i];
    receiptCounter++;
    const amount = 15000 + Math.floor(Math.random() * 15000);
    const daysAgo = Math.floor(Math.random() * 30);
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - daysAgo);

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber: `CASH-${new Date().getFullYear()}-${receiptCounter.toString().padStart(5, '0')}`,
        receiptDate,
        amount,
        paymentMode: 'CASH',
        admissionId: adm.id,
      },
    });
    cashReceiptIds.push(receipt.id);
    console.log(`  CASH receipt for ${adm.student.firstName} ${adm.student.lastName}: ₹${amount}`);
  }
  console.log(`✅ Created ${cashReceiptIds.length} CASH receipts\n`);

  // ═══════════════════════════════════════════════════════════
  // 2. CHEQUE RECEIPTS (undeposited) — for Deposit Slip Automated
  // ═══════════════════════════════════════════════════════════
  console.log('Creating CHEQUE receipts (undeposited)...');
  const chequeReceiptIds: string[] = [];

  for (let i = 0; i < Math.min(admissions.length, 12); i++) {
    const adm = admissions[Math.min(i + 15, admissions.length - 1)];
    receiptCounter++;
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const amount = 18000 + Math.floor(Math.random() * 12000);
    const daysAgo = Math.floor(Math.random() * 20);
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - daysAgo);

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber: `CHQ-${new Date().getFullYear()}-${receiptCounter.toString().padStart(5, '0')}`,
        receiptDate,
        amount,
        paymentMode: 'CHEQUE',
        chequeNumber: `${100000 + Math.floor(Math.random() * 900000)}`,
        chequeDate: receiptDate,
        bankName: bank.name,
        bankBranch: bank.branch,
        admissionId: adm.id,
        // depositId is null — these are pending deposit
      },
    });
    chequeReceiptIds.push(receipt.id);
    console.log(`  CHEQUE receipt for ${adm.student.firstName} ${adm.student.lastName}: ₹${amount} (${bank.name})`);
  }
  console.log(`✅ Created ${chequeReceiptIds.length} CHEQUE receipts (pending deposit)\n`);

  // ═══════════════════════════════════════════════════════════
  // 3. DEPOSIT SLIPS — for Print & View Deposit Slip
  // ═══════════════════════════════════════════════════════════
  console.log('Creating Deposit Slips...');

  // Create 3 deposit slips with some cheque receipts linked
  const depositBatches = [
    { bank: banks[0], chequeIds: chequeReceiptIds.slice(0, 4) },
    { bank: banks[1], chequeIds: chequeReceiptIds.slice(4, 8) },
    { bank: banks[2], chequeIds: chequeReceiptIds.slice(8, 12) },
  ];

  for (const batch of depositBatches) {
    if (batch.chequeIds.length === 0) continue;
    depositCounter++;

    // Calculate total from receipts
    const batchReceipts = await prisma.receipt.findMany({
      where: { id: { in: batch.chequeIds } },
    });
    const totalAmount = batchReceipts.reduce((sum, r) => sum + Number(r.amount), 0);

    const daysAgo = Math.floor(Math.random() * 15);
    const depositDate = new Date();
    depositDate.setDate(depositDate.getDate() - daysAgo);

    const deposit = await prisma.deposit.create({
      data: {
        depositDate,
        bankName: batch.bank.name,
        bankBranch: batch.bank.branch,
        totalAmount,
        status: 'DEPOSITED',
        slipNumber: `DEP-${new Date().getFullYear()}-${depositCounter.toString().padStart(5, '0')}`,
        schoolId: school.id,
      },
    });

    // Link receipts to this deposit
    await prisma.receipt.updateMany({
      where: { id: { in: batch.chequeIds } },
      data: { depositId: deposit.id },
    });

    console.log(`  Deposit ${deposit.slipNumber}: ${batch.chequeIds.length} cheques, ₹${totalAmount} → ${batch.bank.name}`);
  }
  console.log(`✅ Created ${depositBatches.length} deposit slips\n`);

  // ═══════════════════════════════════════════════════════════
  // 4. ONLINE RECEIPTS — for Homebuddy & Online Payment Details
  // ═══════════════════════════════════════════════════════════
  console.log('Creating ONLINE receipts (Homebuddy & Gateway)...');

  const gateways = ['HDFC_ONLINE', 'PAYTM_POS', 'RAZORPAY'];
  const merchants = ['HDFC', 'Paytm', 'Razorpay'];

  for (let i = 0; i < Math.min(admissions.length, 20); i++) {
    const adm = admissions[i % admissions.length];
    receiptCounter++;
    const amount = 10000 + Math.floor(Math.random() * 20000);
    const gatewayIdx = Math.floor(Math.random() * gateways.length);
    const gateway = gateways[gatewayIdx];
    const paymentMode: PaymentMode = gatewayIdx === 1 ? 'PAYTM_POS' : 'ONLINE';
    const daysAgo = Math.floor(Math.random() * 45);
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - daysAgo);

    const txnId = `${gateway}-TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    await prisma.receipt.create({
      data: {
        receiptNumber: `ONL-${new Date().getFullYear()}-${receiptCounter.toString().padStart(5, '0')}`,
        receiptDate,
        amount,
        paymentMode,
        transactionId: txnId,
        bankName: merchants[gatewayIdx],
        admissionId: adm.id,
        isCancelled: Math.random() < 0.1, // 10% cancelled
      },
    });
    console.log(`  ${paymentMode} receipt for ${adm.student.firstName}: ₹${amount} (${gateway})`);
  }
  console.log(`✅ Created 20 ONLINE/PAYTM receipts\n`);

  // ═══════════════════════════════════════════════════════════
  // 5. BANK_TRANSFER RECEIPTS — for Online Payment variety
  // ═══════════════════════════════════════════════════════════
  console.log('Creating BANK_TRANSFER receipts...');

  for (let i = 0; i < 5; i++) {
    const adm = admissions[Math.floor(Math.random() * admissions.length)];
    receiptCounter++;
    const amount = 20000 + Math.floor(Math.random() * 15000);
    const daysAgo = Math.floor(Math.random() * 30);
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - daysAgo);

    await prisma.receipt.create({
      data: {
        receiptNumber: `BT-${new Date().getFullYear()}-${receiptCounter.toString().padStart(5, '0')}`,
        receiptDate,
        amount,
        paymentMode: 'BANK_TRANSFER',
        transactionId: `NEFT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        bankName: banks[Math.floor(Math.random() * banks.length)].name,
        admissionId: adm.id,
      },
    });
    console.log(`  BANK_TRANSFER for ${adm.student.firstName}: ₹${amount}`);
  }
  console.log(`✅ Created 5 BANK_TRANSFER receipts\n`);

  // ═══════════════════════════════════════════════════════════
  // 6. OnlinePayment table entries — for Online Payment Details page
  // ═══════════════════════════════════════════════════════════
  console.log('Creating OnlinePayment records...');

  for (let i = 0; i < 15; i++) {
    const adm = admissions[i % admissions.length];
    const amount = 12000 + Math.floor(Math.random() * 18000);
    const gatewayIdx = Math.floor(Math.random() * gateways.length);
    const statuses = ['SUCCESS', 'PENDING', 'FAILED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.onlinePayment.create({
      data: {
        admissionId: adm.id,
        amount,
        gateway: gateways[gatewayIdx],
        transactionId: status !== 'PENDING' ? `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}` : null,
        status,
        paidAt: status === 'SUCCESS' ? new Date() : null,
        paymentLink: `https://pay.sems.suryadhi.in/pay/${adm.id}/${Date.now()}`,
        metadata: { gateway: gateways[gatewayIdx], merchant: merchants[gatewayIdx] },
      },
    });
  }
  console.log(`✅ Created 15 OnlinePayment records\n`);

  console.log('🎉 Fee Collection seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`  • ${cashReceiptIds.length} CASH receipts (Convert Cash pages)`);
  console.log(`  • ${chequeReceiptIds.length} CHEQUE receipts (Deposit Slip pages)`);
  console.log(`  • ${depositBatches.length} Deposit slips (Print & View)`);
  console.log(`  • 20 ONLINE/PAYTM receipts (Homebuddy & Online Payment)`);
  console.log(`  • 5 BANK_TRANSFER receipts`);
  console.log(`  • 15 OnlinePayment gateway records`);
}

main()
  .catch((e) => {
    console.error('❌ Fee seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

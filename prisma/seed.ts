import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Roles
  const roleAdmin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Admin',
      created_at: new Date(),
    },
  });

  const roleUser = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'User',
      created_at: new Date(),
    },
  });

  // JobTitles
  const jobDev = await prisma.jobTitle.upsert({
    where: { id: 'DEV' },
    update: {},
    create: {
      id: 'DEV',
      name: 'Developer',
      created_at: new Date(),
    },
  });

  const jobHr = await prisma.jobTitle.upsert({
    where: { id: 'HR' },
    update: {},
    create: {
      id: 'HR',
      name: 'HR Manager',
      created_at: new Date(),
    },
  });

  // Departments
  const deptIT = await prisma.department.upsert({
    where: { id: 'IT' },
    update: {},
    create: {
      id: 'IT',
      name: 'Information Technology',
      created_at: new Date(),
    },
  });

  const deptHR = await prisma.department.upsert({
    where: { id: 'HR' },
    update: {},
    create: {
      id: 'HR',
      name: 'Human Resources',
      created_at: new Date(),
    },
  });

  // LeaveTypes
  const leaveSick = await prisma.leaveType.upsert({
    where: { id: 'SICK' },
    update: {},
    create: {
      id: 'SICK',
      name: 'ลาป่วย',
      created_at: new Date(),
    },
  });

  const leaveVacation = await prisma.leaveType.upsert({
    where: { id: 'VAC' },
    update: {},
    create: {
      id: 'VAC',
      name: 'ลากิจ',
      created_at: new Date(),
    },
  });

  // UserInfos
  const user1 = await prisma.userInfo.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      first_name: 'สมชาย',
      last_name: 'ใจดี',
      email: 'user1@example.com',
      role_id: roleUser.id,
      job_title_id: jobDev.id,
      department_id: deptIT.id,
      created_at: new Date(),
    },
  });

  const user2 = await prisma.userInfo.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      first_name: 'อภิชา',
      last_name: 'ผู้ดูแล',
      email: 'admin@example.com',
      role_id: roleAdmin.id,
      job_title_id: jobHr.id,
      department_id: deptHR.id,
      created_at: new Date(),
    },
  });

  // Accounts
  await prisma.account.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      google_id: 'google-user1-id',
      email: 'user1@example.com',
      user_id: user1.id,
      created_at: new Date(),
    },
  });

  await prisma.account.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      google_id: 'google-admin-id',
      email: 'admin@example.com',
      user_id: user2.id,
      approved_by: user2.id,
      approved_at: new Date(),
      created_at: new Date(),
    },
  });

  // Holidays
  await prisma.holiday.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'วันหยุดปีใหม่',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-01-01'),
      total_days: 1,
      color: '#FF0000',
      created_by: user2.id,
      created_at: new Date(),
    },
  });

  // Leaves
  await prisma.leave.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      user_id: user1.id,
      leave_type_id: leaveSick.id,
      start_date: new Date('2025-05-10'),
      end_date: new Date('2025-05-12'),
      reason: 'ป่วยเป็นไข้หวัด',
      status: 'approved',
      created_by: user2.id,
      created_at: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Seed Departments ---
  const itDept = await prisma.department.create({
    data: {
      id: 'D001',
      name: 'IT Department',
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      id: 'D002',
      name: 'HR Department',
    },
  });

  // --- Seed Job Titles ---
  const devJob = await prisma.jobTitle.create({
    data: {
      id: 'JT001',
      name: 'Developer',
      department_id: itDept.id,
    },
  });

  const hrJob = await prisma.jobTitle.create({
    data: {
      id: 'JT002',
      name: 'HR Specialist',
      department_id: hrDept.id,
    },
  });

  // --- Seed Roles ---
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });

  const staffRole = await prisma.role.create({
    data: {
      name: 'Staff',
    },
  });

  // --- Seed Permissions ---
  const manageLeavePermission = await prisma.permission.create({
    data: {
      name: 'manage_leave',
    },
  });

  const viewCalendarPermission = await prisma.permission.create({
    data: {
      name: 'view_calendar',
    },
  });

  // --- Assign Permissions to Roles ---
  await prisma.rolePermission.createMany({
    data: [
      {
        role_id: adminRole.id,
        permission_id: manageLeavePermission.id,
      },
      {
        role_id: adminRole.id,
        permission_id: viewCalendarPermission.id,
      },
      {
        role_id: staffRole.id,
        permission_id: viewCalendarPermission.id,
      },
    ],
  });

  // --- Seed Users ---
  const adminUser = await prisma.userInfo.create({
    data: {
      first_name: 'สมชาย',
      last_name: 'ผู้ดูแล',
      email: 'admin@example.com',
      role_id: adminRole.id,
      job_title_id: devJob.id,
      department_id: itDept.id,
      birth_date: new Date('1990-01-01'),
    },
  });

  const staffUser = await prisma.userInfo.create({
    data: {
      first_name: 'สมหญิง',
      last_name: 'พนักงาน',
      email: 'staff@example.com',
      role_id: staffRole.id,
      job_title_id: hrJob.id,
      department_id: hrDept.id,
      birth_date: new Date('1995-05-05'),
    },
  });

  // --- Seed Accounts ---
  await prisma.account.createMany({
    data: [
      {
        google_id: 'google-uid-001',
        email: 'admin@example.com',
        user_id: adminUser.id,
        approved_by: adminUser.id,
        approved_at: new Date(),
      },
      {
        google_id: 'google-uid-002',
        email: 'staff@example.com',
        user_id: staffUser.id,
        approved_by: adminUser.id,
        approved_at: new Date(),
      },
    ],
  });

  // --- Seed Leave Types ---
  const sickLeave = await prisma.leaveType.create({
    data: {
      id: 'L001',
      name: 'ลาป่วย',
    },
  });

  const vacationLeave = await prisma.leaveType.create({
    data: {
      id: 'L002',
      name: 'ลาพักร้อน',
    },
  });

  // --- Seed Holidays ---
  await prisma.holiday.create({
    data: {
      title: 'วันปีใหม่',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-01-01'),
      total_days: 1,
      color: '#FF0000',
      created_by: adminUser.id,
    },
  });

  // --- Seed Leave Requests ---
  await prisma.leave.create({
    data: {
      user_id: staffUser.id,
      leave_type_id: vacationLeave.id,
      start_date: new Date('2025-05-20'),
      end_date: new Date('2025-05-22'),
      reason: 'ไปเที่ยวทะเล',
      status: 'pending',
      created_by: staffUser.id,
    },
  });
}

main()
  .then(async () => {
    console.log('✅ Seed completed successfully');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

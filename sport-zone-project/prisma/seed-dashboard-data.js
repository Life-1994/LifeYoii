const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 إضافة بيانات تجريبية للوحة التحكم...')

  // إضافة مدربين
  const trainers = [
    { name: 'أحمد الشريف', email: 'ahmed@sportzone.com', phone: '0501234567', specialty: 'تدريب وزن', status: 'active' },
    { name: 'محمد الغامدي', email: 'mohammed@sportzone.com', phone: '0501234568', specialty: 'تدريب قلبي', status: 'active' },
    { name: 'خالد العتيبي', email: 'khalid@sportzone.com', phone: '0501234569', specialty: 'يوغا', status: 'active' },
    { name: 'عبدالله السعيد', email: 'abdullah@sportzone.com', phone: '0501234570', specialty: 'كروس فت', status: 'active' },
  ]

  for (const trainer of trainers) {
    await prisma.trainer.create({
      data: trainer,
    }).catch(() => console.log(`Trainer ${trainer.name} already exists`))
  }
  console.log('✅ تم إضافة المدربين')

  // الحصول على المدربين
  const allTrainers = await prisma.trainer.findMany()

  // إضافة حصص
  if (allTrainers.length > 0) {
    const classes = [
      { name: 'تدريب الوزن المتقدم', trainerId: allTrainers[0].id, capacity: 10, duration: 60, description: 'حصة تدريب وزن للمحترفين' },
      { name: 'الكارديو الصباحي', trainerId: allTrainers[1].id, capacity: 15, duration: 45, description: 'حصة كارديو منشطة' },
      { name: 'يوغا المساء', trainerId: allTrainers[2].id, capacity: 20, duration: 60, description: 'جلسة يوغا مريحة' },
      { name: 'كروس فت', trainerId: allTrainers[3].id, capacity: 12, duration: 50, description: 'تمارين كروس فت مكثفة' },
    ]

    for (const cls of classes) {
      await prisma.class.create({
        data: cls,
      }).catch(() => console.log(`Class ${cls.name} already exists`))
    }
    console.log('✅ تم إضافة الحصص')
  }

  // إضافة بيانات الإيرادات والمصروفات
  const today = new Date()
  
  // إيرادات لآخر 12 شهر
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, Math.floor(Math.random() * 28) + 1)
    const amount = Math.floor(Math.random() * 30000) + 50000
    
    await prisma.revenue.create({
      data: {
        amount,
        source: 'subscription',
        description: `إيرادات اشتراكات شهر ${i + 1}`,
        date,
      },
    }).catch(() => {})
  }
  console.log('✅ تم إضافة الإيرادات')

  // مصروفات لآخر 12 شهر
  const expenseCategories = ['rent', 'salaries', 'equipment', 'utilities', 'maintenance']
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, Math.floor(Math.random() * 28) + 1)
    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
    const amount = Math.floor(Math.random() * 20000) + 10000
    
    await prisma.expense.create({
      data: {
        amount,
        category,
        description: `${category} شهر ${i + 1}`,
        date,
      },
    }).catch(() => {})
  }
  console.log('✅ تم إضافة المصروفات')

  // إضافة بيانات الحضور لآخر 30 يوم
  const members = await prisma.member.findMany({ take: 10 })
  
  if (members.length > 0) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // عدد عشوائي من الأعضاء يحضرون كل يوم
      const attendanceCount = Math.floor(Math.random() * members.length) + 5
      
      for (let j = 0; j < attendanceCount && j < members.length; j++) {
        const checkInDate = new Date(date)
        checkInDate.setHours(Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 60))
        
        await prisma.attendance.create({
          data: {
            memberId: members[j].id,
            checkIn: checkInDate,
            date: date.toISOString().split('T')[0],
          },
        }).catch(() => {})
      }
    }
    console.log('✅ تم إضافة بيانات الحضور')
  }

  // إضافة حجوزات
  const allClasses = await prisma.class.findMany()
  if (members.length > 0 && allClasses.length > 0) {
    for (let i = 0; i < 20; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + Math.floor(Math.random() * 7))
      
      await prisma.booking.create({
        data: {
          memberId: members[Math.floor(Math.random() * members.length)].id,
          classId: allClasses[Math.floor(Math.random() * allClasses.length)].id,
          date,
          status: ['confirmed', 'completed'][Math.floor(Math.random() * 2)],
        },
      }).catch(() => {})
    }
    console.log('✅ تم إضافة الحجوزات')
  }

  console.log('🎉 تم إضافة جميع البيانات التجريبية بنجاح!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

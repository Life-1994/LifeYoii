const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إعداد قاعدة البيانات...')

  // إنشاء مستخدم Admin
  const hashedPassword = await hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sportzone.com' },
    update: {},
    create: {
      email: 'admin@sportzone.com',
      name: 'المدير العام',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ تم إنشاء المستخدم:', admin.email)

  // إنشاء باقات افتراضية
  const packages = [
    {
      name: 'باقة شهرية',
      nameEn: 'Monthly Package',
      duration: 30,
      price: 200,
      description: 'اشتراك لمدة شهر واحد',
      features: JSON.stringify(['دخول غير محدود', 'استخدام جميع الأجهزة']),
      isActive: true,
    },
    {
      name: 'باقة ربع سنوية',
      nameEn: '3 Months Package',
      duration: 90,
      price: 500,
      description: 'اشتراك لمدة 3 أشهر',
      features: JSON.stringify(['دخول غير محدود', 'استخدام جميع الأجهزة', 'خصم 15%']),
      isActive: true,
    },
    {
      name: 'باقة نصف سنوية',
      nameEn: '6 Months Package',
      duration: 180,
      price: 900,
      description: 'اشتراك لمدة 6 أشهر',
      features: JSON.stringify(['دخول غير محدود', 'استخدام جميع الأجهزة', 'خصم 25%', 'جلسة تدريب مجانية']),
      isActive: true,
    },
    {
      name: 'باقة سنوية',
      nameEn: 'Annual Package',
      duration: 365,
      price: 1600,
      description: 'اشتراك لمدة سنة كاملة',
      features: JSON.stringify(['دخول غير محدود', 'استخدام جميع الأجهزة', 'خصم 35%', 'جلستين تدريب مجانية', 'متابعة شهرية']),
      isActive: true,
    },
  ]

  for (const pkg of packages) {
    await prisma.package.create({
      data: pkg,
    }).catch(() => {
      console.log(`Package ${pkg.name} already exists, skipping...`)
    })
  }

  console.log('✅ تم إنشاء الباقات الافتراضية')

  // إنشاء إعدادات افتراضية
  const settings = [
    { key: 'gym_name', value: 'Sport Zone - المنطقة الرياضية' },
    { key: 'gym_phone', value: '+966 XX XXX XXXX' },
    { key: 'gym_email', value: 'info@sportzone.com' },
    { key: 'currency', value: 'SAR' },
    { key: 'timezone', value: 'Asia/Riyadh' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ تم إنشاء الإعدادات الافتراضية')
  console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!')
  console.log('\n📧 البريد الإلكتروني: admin@sportzone.com')
  console.log('🔑 كلمة المرور: admin123')
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

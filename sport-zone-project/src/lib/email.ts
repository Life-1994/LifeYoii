import nodemailer from "nodemailer"

/**
 * إنشاء transporter للبريد الإلكتروني
 */
function createTransporter() {
  // في بيئة التطوير، استخدم ethereal.email للاختبار
  // في بيئة الإنتاج، استخدم SMTP حقيقي
  if (process.env.NODE_ENV === "development" || !process.env.EMAIL_SERVER) {
    // للاختبار فقط - سيتم طباعة الرابط في console
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "test@test.com",
        pass: process.env.EMAIL_PASSWORD || "test",
      },
    })
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: process.env.EMAIL_SERVER_PORT === "465",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

/**
 * إرسال بريد إلكتروني
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const transporter = createTransporter()
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Sport Zone" <noreply@sportzone.com>',
      to,
      subject,
      html,
    })

    console.log("📧 تم إرسال البريد الإلكتروني:", info.messageId)
    
    // في بيئة التطوير، اطبع رابط المعاينة
    if (process.env.NODE_ENV === "development") {
      console.log("🔗 معاينة البريد:", nodemailer.getTestMessageUrl(info))
    }

    return { success: true }
  } catch (error) {
    console.error("❌ خطأ في إرسال البريد:", error)
    return { success: false, error: "فشل إرسال البريد الإلكتروني" }
  }
}

/**
 * إرسال بريد إعادة تعيين كلمة المرور
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #2563eb;
            margin-bottom: 30px;
          }
          .content {
            color: #374151;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🏋️ Sport Zone</h1>
          <div class="content">
            <h2>إعادة تعيين كلمة المرور</h2>
            <p>مرحباً،</p>
            <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
            <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
          </div>
          <div class="button-container">
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
          </div>
          <div class="content">
            <p>أو انسخ الرابط التالي والصقه في متصفحك:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.</p>
          </div>
          <div class="footer">
            <p>Sport Zone - المنطقة الرياضية</p>
            <p>هذا بريد إلكتروني آلي، الرجاء عدم الرد عليه.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "إعادة تعيين كلمة المرور - Sport Zone",
    html,
  })
}

/**
 * إرسال كود التحقق بخطوتين
 */
export async function sendTwoFactorCode(email: string, code: string) {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #2563eb;
            margin-bottom: 30px;
          }
          .code-box {
            background-color: #f3f4f6;
            border: 2px solid #2563eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 8px;
            font-family: monospace;
          }
          .content {
            color: #374151;
            line-height: 1.6;
          }
          .footer {
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🏋️ Sport Zone</h1>
          <div class="content">
            <h2>كود التحقق بخطوتين</h2>
            <p>مرحباً،</p>
            <p>استخدم الكود التالي لإكمال عملية تسجيل الدخول:</p>
          </div>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <div class="content">
            <p><strong>ملاحظة:</strong> هذا الكود صالح لمدة 10 دقائق فقط.</p>
            <p>إذا لم تحاول تسجيل الدخول، يرجى تجاهل هذا البريد وتأمين حسابك.</p>
          </div>
          <div class="footer">
            <p>Sport Zone - المنطقة الرياضية</p>
            <p>هذا بريد إلكتروني آلي، الرجاء عدم الرد عليه.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "كود التحقق بخطوتين - Sport Zone",
    html,
  })
}

/**
 * إرسال بريد التحقق من البريد الإلكتروني
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #2563eb;
            margin-bottom: 30px;
          }
          .content {
            color: #374151;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🏋️ Sport Zone</h1>
          <div class="content">
            <h2>مرحباً بك في Sport Zone!</h2>
            <p>شكراً لتسجيلك معنا.</p>
            <p>الرجاء التحقق من بريدك الإلكتروني بالنقر على الزر أدناه:</p>
          </div>
          <div class="button-container">
            <a href="${verifyUrl}" class="button">تحقق من البريد الإلكتروني</a>
          </div>
          <div class="content">
            <p>أو انسخ الرابط التالي والصقه في متصفحك:</p>
            <p style="word-break: break-all; color: #2563eb;">${verifyUrl}</p>
            <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة 24 ساعة.</p>
          </div>
          <div class="footer">
            <p>Sport Zone - المنطقة الرياضية</p>
            <p>هذا بريد إلكتروني آلي، الرجاء عدم الرد عليه.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "تحقق من بريدك الإلكتروني - Sport Zone",
    html,
  })
}

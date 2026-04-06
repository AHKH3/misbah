/**
 * Email Template: Payment Confirmed - Create Your Password
 * Sent to teachers after payment is confirmed by admin
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PaymentConfirmedEmailProps {
  teacherName: string;
  invitationUrl: string;
  expiryHours: number;
  profileSlug: string;
}

export default function PaymentConfirmedEmail({
  teacherName,
  invitationUrl,
  expiryHours = 72,
  profileSlug,
}: PaymentConfirmedEmailProps) {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>تم تأكيد الدفع - أنشئ كلمة مرورك الآن</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎊 تم تأكيد الدفع!</Heading>

          <Text style={text}>عزيزي/عزيزتي {teacherName},</Text>

          <Text style={text}>
            تم تأكيد دفعتك بنجاح. <strong>ملفك التعريفي جاهز للنشر!</strong>
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              ✅ الاشتراك السنوي مُفعّل
            </Text>
            <Text style={highlightText}>
              ✅ ملفك التعريفي سيُنشر فوراً بعد إنشاء كلمة المرور
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            الخطوة الأخيرة: أنشئ حسابك
          </Heading>

          <Text style={text}>
            لإكمال التسجيل، يرجى الضغط على الرابط أدناه لإنشاء كلمة مرورك:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              إنشاء كلمة المرور
            </Button>
          </Section>

          <Text style={smallText}>
            أو انسخ الرابط التالي في متصفحك:
            <br />
            <Link href={invitationUrl} style={link}>
              {invitationUrl}
            </Link>
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              ⚠️ <strong>مهم:</strong> هذا الرابط صالح لمدة {expiryHours} ساعة فقط.
              يرجى إنشاء حسابك في أقرب وقت.
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            ماذا بعد؟
          </Heading>

          <Text style={text}>بعد إنشاء كلمة المرور:</Text>
          <Text style={listItem}>
            1. ستتمكن من تسجيل الدخول إلى حسابك في مصباح
          </Text>
          <Text style={listItem}>
            2. سيُنشر ملفك التعريفي مباشرة على الموقع
          </Text>
          <Text style={listItem}>
            3. ستبدأ في الظهور في نتائج البحث ودليل المعلمين
          </Text>

          <Text style={profileText}>
            سيكون رابط ملفك التعريفي:
            <br />
            <Link
              href={`https://misbah.site/teachers/${profileSlug}`}
              style={profileLink}
            >
              misbah.site/teachers/{profileSlug}
            </Link>
          </Text>

          <Hr style={hr} />

          <Text style={footerText}>
            إذا كان لديك أي استفسار، تواصل معنا عبر:{' '}
            <Link href="mailto:admin@misbah.site" style={link}>
              admin@misbah.site
            </Link>
          </Text>

          <Text style={footerText}>
            نتمنى لك التوفيق في رحلتك التعليمية مع مصباح!
            <br />
            فريق مصباح
          </Text>

          <Hr style={hr} />

          <Text style={disclaimer}>
            إذا لم تطلب هذا الإيميل، يرجى تجاهله.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================
// STYLES
// ============================================

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '24px 0 16px',
};

const text = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const highlightBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const highlightText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const warningBox = {
  backgroundColor: '#fff9e6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '32px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '48px',
  padding: '0 32px',
  textAlign: 'center' as const,
  textDecoration: 'none',
};

const link = {
  color: '#404040',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const listItem = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const profileText = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const profileLink = {
  color: '#1a1a1a',
  fontWeight: '600',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
};

const smallText = {
  color: '#737373',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#737373',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const disclaimer = {
  color: '#a3a3a3',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

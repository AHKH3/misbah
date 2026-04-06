/**
 * Email Template: Profile Approved - Payment Required
 * Sent to regular teachers after admin approval
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

interface ApprovedEmailProps {
  teacherName: string;
  paymentUrl: string;
  profileId: string;
}

export default function ApprovedEmail({
  teacherName,
  paymentUrl,
  profileId,
}: ApprovedEmailProps) {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>تم قبول طلبك في مصباح - أكمل الدفع الآن</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 مبارك! تم قبولك في مصباح</Heading>

          <Text style={text}>مرحباً {teacherName},</Text>

          <Text style={text}>
            يسعدنا إبلاغك بأن <strong>ملفك التعريفي تمت الموافقة عليه</strong> من قبل
            فريق المراجعة في مصباح.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              ✅ تم مراجعة معلوماتك، مؤهلاتك، وعينة الفيديو التعليمي
            </Text>
            <Text style={highlightText}>
              ✅ أنت الآن مؤهل للانضمام إلى دليل مصباح للمعلمين
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            الخطوة التالية: إتمام الدفع
          </Heading>

          <Text style={text}>
            لإكمال حسابك ونشر ملفك التعريفي على الموقع، يرجى إتمام عملية الدفع
            السنوي.
          </Text>

          <Text style={priceText}>الاشتراك السنوي: <strong>600 جنيه مصري</strong></Text>

          <Section style={buttonContainer}>
            <Button style={button} href={paymentUrl}>
              إتمام الدفع الآن
            </Button>
          </Section>

          <Text style={smallText}>
            أو انسخ الرابط التالي في متصفحك:
            <br />
            <Link href={paymentUrl} style={link}>
              {paymentUrl}
            </Link>
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            طريقة الدفع
          </Heading>

          <Text style={text}>يمكنك الدفع عبر:</Text>
          <Text style={listItem}>• إنستا باي (InstaPay)</Text>
          <Text style={listItem}>• فودافون كاش (Vodafone Cash)</Text>

          <Text style={text}>
            بعد الدفع، يرجى رفع صورة الإيصال. سيتم تأكيد الدفع خلال 24 ساعة.
          </Text>

          <Hr style={hr} />

          <Text style={footerText}>
            إذا كان لديك أي استفسار، لا تتردد في التواصل معنا عبر:{' '}
            <Link href="mailto:admin@misbah.site" style={link}>
              admin@misbah.site
            </Link>
          </Text>

          <Text style={footerText}>
            مع أطيب التحيات،
            <br />
            فريق مصباح
          </Text>

          <Hr style={hr} />

          <Text style={disclaimer}>
            معرّف الملف التعريفي: {profileId}
            <br />
            هذا الإيميل تم إرساله إليك لأنك تقدمت بطلب للانضمام إلى دليل مصباح.
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

const priceText = {
  color: '#1a1a1a',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '16px 0',
  textAlign: 'center' as const,
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

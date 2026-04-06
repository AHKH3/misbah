/**
 * Email Template: Profile Rejected
 * Sent to teachers whose profile was not approved
 */

import {
  Body,
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

interface RejectedEmailProps {
  teacherName: string;
  rejectionReason: string;
  canReapplyDate?: string; // Optional - if banned
  reapplyUrl: string;
}

export default function RejectedEmail({
  teacherName,
  rejectionReason,
  canReapplyDate,
  reapplyUrl,
}: RejectedEmailProps) {
  const isBanned = !!canReapplyDate;

  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>نتيجة طلب الانضمام إلى مصباح</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>نتيجة طلب الانضمام</Heading>

          <Text style={text}>عزيزي/عزيزتي {teacherName},</Text>

          <Text style={text}>
            شكراً لتقديمك طلب الانضمام إلى دليل مصباح للمعلمين. بعد مراجعة دقيقة
            لملفك التعريفي، نأسف لإبلاغك بأنه <strong>لم تتم الموافقة عليه</strong>{' '}
            في الوقت الحالي.
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            سبب الرفض
          </Heading>

          <Section style={reasonBox}>
            <Text style={reasonText}>{rejectionReason}</Text>
          </Section>

          <Hr style={hr} />

          {isBanned ? (
            <>
              <Heading as="h2" style={h2}>
                إعادة التقديم
              </Heading>

              <Section style={warningBox}>
                <Text style={warningText}>
                  ⏳ يمكنك إعادة التقديم بعد تاريخ:{' '}
                  <strong>{canReapplyDate}</strong>
                </Text>
              </Section>

              <Text style={text}>
                سيُطلب منك دفع <strong>رسوم مراجعة إضافية</strong> عند إعادة
                التقديم.
              </Text>
            </>
          ) : (
            <>
              <Heading as="h2" style={h2}>
                يمكنك إعادة التقديم
              </Heading>

              <Text style={text}>
                يُسمح لك بإعادة التقديم بعد معالجة الملاحظات المذكورة أعلاه.
                يُرجى التأكد من:
              </Text>

              <Text style={listItem}>
                • توفير معلومات كاملة ودقيقة عن مؤهلاتك وخبراتك
              </Text>
              <Text style={listItem}>
                • رفع فيديو تعليمي واضح وذو جودة جيدة (درس كامل ≥ 20 دقيقة أو
                تلاوة صفحة كاملة)
              </Text>
              <Text style={listItem}>
                • التأكد من أنك معلم مستقل (وليس مؤسسة تعليمية)
              </Text>
              <Text style={listItem}>
                • الالتزام بسياسات ونطاق مصباح (تعليم القرآن، العربية، والدراسات
                الإسلامية فقط)
              </Text>

              <Text style={reapplyText}>
                لإعادة التقديم، يُرجى زيارة:{' '}
                <Link href={reapplyUrl} style={link}>
                  {reapplyUrl}
                </Link>
              </Text>
            </>
          )}

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            معايير القبول في مصباح
          </Heading>

          <Text style={text}>مصباح هو دليل احترافي للمعلمين المستقلين فقط:</Text>
          <Text style={listItem}>
            • <strong>نطاق المحتوى:</strong> القرآن الكريم، اللغة العربية،
            الدراسات الإسلامية
          </Text>
          <Text style={listItem}>
            • <strong>معلمون مستقلون فقط:</strong> لا نقبل المؤسسات أو الأكاديميات
          </Text>
          <Text style={listItem}>
            • <strong>فيديو تعليمي مطلوب:</strong> عينة واضحة من أسلوب التدريس
          </Text>
          <Text style={listItem}>
            • <strong>مراجعة بشرية:</strong> يتم فحص كل ملف تعريفي يدوياً
          </Text>

          <Hr style={hr} />

          <Text style={footerText}>
            إذا كان لديك أي استفسار حول سبب الرفض أو كيفية تحسين ملفك
            التعريفي، لا تتردد في التواصل معنا:
          </Text>

          <Text style={footerText}>
            <Link href="mailto:admin@misbah.site" style={link}>
              admin@misbah.site
            </Link>
          </Text>

          <Text style={footerText}>
            نتمنى لك التوفيق،
            <br />
            فريق مصباح
          </Text>

          <Hr style={hr} />

          <Text style={disclaimer}>
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

const reasonBox = {
  backgroundColor: '#ffebe6',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const reasonText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontWeight: '500',
};

const warningBox = {
  backgroundColor: '#fff9e6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const listItem = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const reapplyText = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#404040',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
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

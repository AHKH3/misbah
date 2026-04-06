import {
  Hero,
  SocialProof,
  ForStudents,
  ForTeachers,
  HowItWorks,
  Principles,
  FinalCTA
} from '@/components/landing';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

const FOUNDERS_TOTAL = 30;

export default async function HomePage() {
  let foundersRemaining = FOUNDERS_TOTAL;

  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('status', ['approved', 'published']);

    foundersRemaining = Math.max(0, FOUNDERS_TOTAL - (count ?? 0));
  } catch {
    // Fallback to total if DB is unavailable
  }

  return (
    <main className={styles.page}>
      <Hero foundersRemaining={foundersRemaining} />
      <SocialProof />
      <ForStudents />
      <ForTeachers />
      <HowItWorks />
      <Principles />
      <FinalCTA />
    </main>
  );
}

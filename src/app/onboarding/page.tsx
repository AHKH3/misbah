'use client';

import { redirect } from 'next/navigation';

// Redirect to step-1 by default
export default function OnboardingPage() {
  redirect('/onboarding/step-1');
}

import { createClient } from '@/utils/supabase/server'
import ReviewList from './ReviewList'

export default async function AdminReviewPage() {
  const supabase = await createClient()

  // Fetch profiles that are 'payment_submitted'
  // Also fetch their 'pending' subscription
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions (
        *
      )
    `)
    .eq('status', 'payment_submitted')
    .eq('subscriptions.status', 'pending')

  if (error) {
    return <div>Error loading profiles: {error.message}</div>
  }

  // Filter out profiles where subscriptions might be empty (if inner join logic failed or multiple subs)
  // supabase .eq('subscriptions.status', 'pending') filters the *subscriptions* array, it doesn't filter the parent rows unless we use !inner
  // But for MVP, we filter in JS
  const pendingProfiles = profiles?.filter(p => p.subscriptions && p.subscriptions.length > 0) || []

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Review Dashboard</h1>
      <p>Pending Approvals: {pendingProfiles.length}</p>
      <ReviewList items={pendingProfiles} />
    </div>
  )
}

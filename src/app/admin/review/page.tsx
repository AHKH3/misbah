import { createClient } from '@/utils/supabase/server'
import ReviewList from './ReviewList'

export default async function AdminReviewPage() {
  const supabase = await createClient()

  // Fetch profiles that are 'payment_submitted'
  // Also fetch their 'pending' subscription
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'under_review')

  if (error) {
    return <div>Error loading profiles: {error.message}</div>
  }

  const pendingProfiles = profiles || []

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Review Dashboard</h1>
      <p>Pending Approvals: {pendingProfiles.length}</p>
      <ReviewList items={pendingProfiles} />
    </div>
  )
}

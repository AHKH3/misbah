'use client'

import { approveListing, rejectListing } from '../actions'

export default function ReviewList({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <div>No pending reviews.</div>
  }

  const handleApprove = async (profileId: string, subId: string) => {
    if (!confirm('Activate this profile?')) return
    await approveListing(profileId, subId)
  }

  const handleReject = async (profileId: string, subId: string) => {
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    await rejectListing(profileId, subId, reason)
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {items.map((profile) => {
        // Assume latest subscription is the one to review
        // In a real query we'd filter subscriptions too or join carefully.
        // For MVP we assume 1 active pending subscription.
        const sub = profile.subscriptions?.[0]
        if (!sub) return null

        return (
          <div key={profile.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{profile.full_name}</h3>
            <p><strong>Experience:</strong> {profile.experience_text}</p>
            <p><strong>Subjects:</strong> {profile.subjects.join(', ')}</p>
            
            <div style={{ margin: '1rem 0' }}>
              <strong>Payment Proof:</strong><br/>
              {sub.payment_proof_url ? (
                // In real app, we need a signed URL or public URL.
                // Assuming we can view it (admin policy).
                // We'll just show the path for now or a generic link
                <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${sub.payment_proof_url}`} target="_blank" rel="noreferrer">
                  View Proof ({sub.payment_proof_url})
                </a>
              ) : 'No proof uploaded'}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleApprove(profile.id, sub.id)}
                style={{ background: 'green', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
              >
                Approve & Activate
              </button>
              <button 
                onClick={() => handleReject(profile.id, sub.id)}
                style={{ background: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
              >
                Reject
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

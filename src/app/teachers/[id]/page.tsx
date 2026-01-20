import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subjects, experience_text')
    .eq('id', id)
    .single()

  if (!profile) {
    return {
      title: 'Teacher Not Found'
    }
  }

  return {
    title: `${profile.full_name} - ${profile.subjects.join(', ')} Teacher`,
    description: profile.experience_text.substring(0, 160),
    robots: {
      index: true,
      follow: true,
    }
  }
}

export default async function TeacherProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // ENFORCEMENT: Paid-First / Active Only
  if (profile.status !== 'active') {
    notFound()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{profile.full_name}</h1>
      <p style={{ color: '#666' }}>{profile.subjects.join(', ')} • {profile.teaching_format.replace('_', ' ')}</p>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>About</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{profile.experience_text}</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Target Audience</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {profile.audience.map((a: string) => (
            <span key={a} style={{ background: '#eee', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
              {a}
            </span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Contact</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {profile.contact_method.phone && <li>Phone: {profile.contact_method.phone}</li>}
          {profile.contact_method.email && <li>Email: {profile.contact_method.email}</li>}
          {profile.contact_method.whatsapp && <li>WhatsApp: {profile.contact_method.whatsapp}</li>}
        </ul>
      </section>
    </div>
  )
}

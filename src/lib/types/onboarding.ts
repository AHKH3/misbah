import { z } from 'zod'

export const SubjectEnum = z.enum(['Quran', 'Arabic', 'Islamic Studies'])
export const TeachingFormatEnum = z.literal('online')
export const AudienceEnum = z.enum(['Kids', 'Adults', 'Females Only', 'Males Only', 'Everyone'])

export const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  subjects: z.array(SubjectEnum).min(1, 'Select at least one subject'),
  audience: z.array(AudienceEnum).min(1, 'Select at least one audience group'),
  experience_text: z.string().min(20, 'Please provide more detail about your experience'),
  teaching_format: TeachingFormatEnum,
  contact_method: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional()
  }).refine(data => data.phone || data.email || data.whatsapp, {
    message: "At least one contact method is required"
  }),
})

export type ProfileData = z.infer<typeof ProfileSchema>

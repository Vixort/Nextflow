import type { Metadata } from 'next'
import ContactPageClient from '@/components/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us | Nextflow',
  description:
    'Tell us what you need — a few clicks, no long forms. We reply within 1–2 business days.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
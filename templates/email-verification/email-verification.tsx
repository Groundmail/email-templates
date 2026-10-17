import * as React from 'react'
import { Button, Divider, Layout, LinkFallback, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'

export type EmailVerificationProps = {
  name: string
  verifyUrl: string
  expiresIn: string
}

export const meta: TemplateMeta = {
  name: 'Email verification',
  description: 'Confirms a new address after sign-up or an email change.',
  group: 'Authentication',
  subject: 'Confirm your email address',
}

export default function EmailVerification({ name, verifyUrl, expiresIn }: EmailVerificationProps) {
  return (
    <Layout
      preview="Confirm your email address to finish setting up your account."
      footerNote="You're receiving this because this address was used to create an account."
    >
      <Title>Confirm your email address</Title>
      <P>Hi {name},</P>
      <P>Confirm that this is your email address to finish setting up your account.</P>
      <Button href={verifyUrl}>Confirm email address</Button>
      <Small>
        This link expires in {expiresIn}. If you didn't create an account, you can ignore this email.
      </Small>
      <Divider />
      <LinkFallback href={verifyUrl} />
    </Layout>
  )
}

EmailVerification.PreviewProps = {
  name: 'Ada',
  verifyUrl: 'https://example.com/verify-email?token=2b7d91',
  expiresIn: '24 hours',
} satisfies EmailVerificationProps

export function text({ name, verifyUrl, expiresIn }: EmailVerificationProps) {
  return plainText(
    'Confirm your email address',
    `Hi ${name},`,
    'Confirm that this is your email address to finish setting up your account:',
    verifyUrl,
    `This link expires in ${expiresIn}. If you didn't create an account, you can ignore this email.`,
  )
}

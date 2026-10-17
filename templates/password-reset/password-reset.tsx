import * as React from 'react'
import { Button, Divider, Layout, LinkFallback, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'
import { theme } from '../../theme'

export type PasswordResetProps = {
  name: string
  resetUrl: string
  expiresIn: string
}

export const meta: TemplateMeta = {
  name: 'Password reset',
  description: 'A single-use link to choose a new password, with an expiry and a clear "ignore this" line.',
  group: 'Authentication',
  subject: `Reset your ${theme.brand.name} password`,
}

export default function PasswordReset({ name, resetUrl, expiresIn }: PasswordResetProps) {
  return (
    <Layout
      preview={`Use this link to choose a new password. It expires in ${expiresIn}.`}
      footerNote="You're receiving this because a password reset was requested for your account."
    >
      <Title>Reset your password</Title>
      <P>Hi {name},</P>
      <P>Someone asked to reset the password for your account. Choose a new one with the button below.</P>
      <Button href={resetUrl}>Choose a new password</Button>
      <Small>
        This link expires in {expiresIn} and can only be used once. If you didn't ask for a reset, you can
        ignore this email. Your password won't change.
      </Small>
      <Divider />
      <LinkFallback href={resetUrl} />
    </Layout>
  )
}

PasswordReset.PreviewProps = {
  name: 'Ada',
  resetUrl: 'https://example.com/reset-password?token=8c1f2e',
  expiresIn: '60 minutes',
} satisfies PasswordResetProps

export function text({ name, resetUrl, expiresIn }: PasswordResetProps) {
  return plainText(
    'Reset your password',
    `Hi ${name},`,
    'Someone asked to reset the password for your account. Choose a new one here:',
    resetUrl,
    `This link expires in ${expiresIn} and can only be used once. If you didn't ask for a reset, you can ignore this email. Your password won't change.`,
  )
}

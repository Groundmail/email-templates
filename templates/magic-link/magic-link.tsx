import * as React from 'react'
import { Button, Divider, Layout, LinkFallback, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'
import { theme } from '../../theme'

export type MagicLinkProps = {
  loginUrl: string
  expiresIn: string
}

export const meta: TemplateMeta = {
  name: 'Magic link',
  description: 'Passwordless sign-in: one button, a short expiry and a fallback URL.',
  group: 'Authentication',
  subject: `Your ${theme.brand.name} sign-in link`,
}

export default function MagicLink({ loginUrl, expiresIn }: MagicLinkProps) {
  return (
    <Layout
      preview={`Sign in with one click. This link expires in ${expiresIn}.`}
      footerNote="You're receiving this because someone tried to sign in with this email address."
    >
      <Title>Your sign-in link</Title>
      <P>Click the button below to sign in. No password needed.</P>
      <Button href={loginUrl}>Sign in</Button>
      <Small>
        This link expires in {expiresIn} and works once. If you didn't try to sign in, you can safely ignore
        this email.
      </Small>
      <Divider />
      <LinkFallback href={loginUrl} />
    </Layout>
  )
}

MagicLink.PreviewProps = {
  loginUrl: 'https://example.com/auth/callback?token=4f9a7c',
  expiresIn: '15 minutes',
} satisfies MagicLinkProps

export function text({ loginUrl, expiresIn }: MagicLinkProps) {
  return plainText(
    'Your sign-in link',
    'Open this link to sign in. No password needed:',
    loginUrl,
    `This link expires in ${expiresIn} and works once. If you didn't try to sign in, you can safely ignore this email.`,
  )
}

import * as React from 'react'
import { Button, Details, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText, textDetails } from '../../components/text'
import { theme } from '../../theme'

export type NewSignInProps = {
  name: string
  signedInAt: string
  device: string
  location: string
  ipAddress: string
  secureUrl: string
}

export const meta: TemplateMeta = {
  name: 'New sign-in alert',
  description: 'A security alert for a sign-in from a new device, with details and a "secure my account" path.',
  group: 'Account',
  subject: `New sign-in to your ${theme.brand.name} account`,
}

export default function NewSignIn(props: NewSignInProps) {
  const { name, signedInAt, device, location, ipAddress, secureUrl } = props
  return (
    <Layout
      preview={`Your account was signed in to from ${device} in ${location}.`}
      footerNote="This is a security email about your account, so you get it even if other emails are turned off."
    >
      <Title>New sign-in to your account</Title>
      <P>Hi {name}, your account was just signed in to from a device we haven't seen before.</P>
      <Details
        rows={[
          ['When', signedInAt],
          ['Device', device],
          ['Location', location],
          ['IP address', ipAddress],
        ]}
      />
      <P>
        <strong>If this was you</strong>, there's nothing to do.
      </P>
      <P>
        <strong>If it wasn't</strong>, secure your account now. We'll help you change your password and sign out
        every other session.
      </P>
      <Button href={secureUrl} tone="danger">
        Secure my account
      </Button>
      <Small style={{ margin: 0 }}>Locations are estimated from the IP address and may not be exact.</Small>
    </Layout>
  )
}

NewSignIn.PreviewProps = {
  name: 'Ada',
  signedInAt: 'October 16, 2026 at 9:41 AM UTC',
  device: 'Chrome on macOS',
  location: 'Lisbon, Portugal',
  ipAddress: '203.0.113.42',
  secureUrl: 'https://example.com/account/security',
} satisfies NewSignInProps

export function text(props: NewSignInProps) {
  const { name, signedInAt, device, location, ipAddress, secureUrl } = props
  return plainText(
    'New sign-in to your account',
    `Hi ${name}, your account was just signed in to from a device we haven't seen before.`,
    textDetails([
      ['When', signedInAt],
      ['Device', device],
      ['Location', location],
      ['IP address', ipAddress],
    ]),
    "If this was you, there's nothing to do.",
    `If it wasn't, secure your account now. We'll help you change your password and sign out every other session:\n${secureUrl}`,
    'Locations are estimated from the IP address and may not be exact.',
  )
}

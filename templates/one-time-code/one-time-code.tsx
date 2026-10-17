import * as React from 'react'
import { Code, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'
import { theme } from '../../theme'

export type OneTimeCodeProps = {
  code: string
  expiresIn: string
}

export const meta: TemplateMeta = {
  name: 'One-time code',
  description: 'A large, copyable verification code for 2FA, sign-in or checkout confirmation.',
  group: 'Authentication',
  subject: `{{code}} is your ${theme.brand.name} verification code`,
}

export default function OneTimeCode({ code, expiresIn }: OneTimeCodeProps) {
  return (
    <Layout
      preview={`Your verification code is ${code}. It expires in ${expiresIn}.`}
      footerNote="You're receiving this because a verification code was requested for your account."
    >
      <Title>Your verification code</Title>
      <P>Enter this code to continue:</P>
      <Code>{code}</Code>
      <Small>
        The code expires in {expiresIn}. We will never ask you for this code by phone, chat or email, so don't
        share it with anyone.
      </Small>
      <Small style={{ margin: 0 }}>
        Didn't request a code? Someone may know your password. Change it to keep your account safe.
      </Small>
    </Layout>
  )
}

OneTimeCode.PreviewProps = {
  code: '482913',
  expiresIn: '10 minutes',
} satisfies OneTimeCodeProps

export function text({ code, expiresIn }: OneTimeCodeProps) {
  return plainText(
    'Your verification code',
    `Enter this code to continue: ${code}`,
    `The code expires in ${expiresIn}. We will never ask you for this code by phone, chat or email, so don't share it with anyone.`,
    "Didn't request a code? Someone may know your password. Change it to keep your account safe.",
  )
}

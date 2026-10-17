import * as React from 'react'
import { A, Button, Divider, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'
import { theme } from '../../theme'

export type WelcomeProps = {
  name: string
  dashboardUrl: string
  helpUrl: string
}

export const meta: TemplateMeta = {
  name: 'Welcome',
  description: 'A short first email after sign-up: three next steps and one button.',
  group: 'Account',
  subject: `Welcome to ${theme.brand.name}`,
}

const steps: Array<[string, string]> = [
  ['Set up your workspace', 'Add your details so everything is ready when you need it.'],
  ['Invite your team', 'Work together from day one. Teammates join with one click.'],
  ['Get help any time', 'Reply to this email and a real person will get back to you.'],
]

export default function Welcome({ name, dashboardUrl, helpUrl }: WelcomeProps) {
  return (
    <Layout
      preview="Your account is ready. Here are three good places to start."
      footerNote="You're receiving this because you just created an account."
    >
      <Title>Welcome, {name}</Title>
      <P>Thanks for signing up. Your account is ready. Here are three good places to start:</P>
      {steps.map(([title, body], index) => (
        <P key={title} style={{ margin: '0 0 12px' }}>
          <strong>
            {index + 1}. {title}
          </strong>
          <br />
          <span className="em-muted" style={{ color: theme.colors.light.muted }}>
            {body}
          </span>
        </P>
      ))}
      <Button href={dashboardUrl}>Go to your dashboard</Button>
      <Divider />
      <Small style={{ margin: 0 }}>
        Questions? Reply to this email or visit the <A href={helpUrl}>help center</A>.
      </Small>
    </Layout>
  )
}

Welcome.PreviewProps = {
  name: 'Ada',
  dashboardUrl: 'https://example.com/dashboard',
  helpUrl: 'https://example.com/help',
} satisfies WelcomeProps

export function text({ name, dashboardUrl, helpUrl }: WelcomeProps) {
  return plainText(
    `Welcome, ${name}`,
    'Thanks for signing up. Your account is ready. Here are three good places to start:',
    steps.map(([title, body], index) => `${index + 1}. ${title}\n   ${body}`).join('\n\n'),
    `Go to your dashboard: ${dashboardUrl}`,
    `Questions? Reply to this email or visit the help center: ${helpUrl}`,
  )
}

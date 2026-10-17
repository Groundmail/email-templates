import * as React from 'react'
import { Button, Details, Layout, Meter, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText, textDetails } from '../../components/text'

export type UsageAlertProps = {
  name: string
  metric: string
  usagePercent: string
  used: string
  limit: string
  resetsOn: string
  upgradeUrl: string
}

export const meta: TemplateMeta = {
  name: 'Usage alert',
  description: 'Warns before a plan limit is hit, with a progress bar and the reset date.',
  group: 'Billing',
  subject: "You've used {{usage_percent}}% of your {{metric}}",
}

export default function UsageAlert(props: UsageAlertProps) {
  const { name, metric, usagePercent, used, limit, resetsOn, upgradeUrl } = props
  return (
    <Layout
      preview={`You've used ${used} of ${limit} ${metric}. Your limit resets on ${resetsOn}.`}
      footerNote="You're receiving this because usage alerts are on for your account."
    >
      <Title>
        You've used {usagePercent}% of your {metric}
      </Title>
      <P>Hi {name}, you're getting close to your plan's limit for this billing period.</P>
      <Meter percent={usagePercent} />
      <Details
        rows={[
          ['Used', `${used} of ${limit}`],
          ['Resets on', resetsOn],
        ]}
      />
      <P>To avoid interruptions, upgrade your plan before you reach the limit.</P>
      <Button href={upgradeUrl}>Upgrade plan</Button>
      <Small style={{ margin: 0 }}>You can change when you get these alerts in your account settings.</Small>
    </Layout>
  )
}

UsageAlert.PreviewProps = {
  name: 'Ada',
  metric: 'monthly API requests',
  usagePercent: '80',
  used: '80,000',
  limit: '100,000',
  resetsOn: 'November 1, 2026',
  upgradeUrl: 'https://example.com/billing/plans',
} satisfies UsageAlertProps

export function text(props: UsageAlertProps) {
  const { name, metric, usagePercent, used, limit, resetsOn, upgradeUrl } = props
  return plainText(
    `You've used ${usagePercent}% of your ${metric}`,
    `Hi ${name}, you're getting close to your plan's limit for this billing period.`,
    textDetails([
      ['Used', `${used} of ${limit}`],
      ['Resets on', resetsOn],
    ]),
    `To avoid interruptions, upgrade your plan before you reach the limit: ${upgradeUrl}`,
    'You can change when you get these alerts in your account settings.',
  )
}

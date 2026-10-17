import * as React from 'react'
import { Button, Details, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText, textDetails } from '../../components/text'

export type SubscriptionRenewalProps = {
  name: string
  planName: string
  amount: string
  renewalDate: string
  paymentMethod: string
  manageUrl: string
}

export const meta: TemplateMeta = {
  name: 'Subscription renewal',
  description: 'An upcoming-renewal reminder with the amount, date and card, sent before the charge.',
  group: 'Billing',
  subject: 'Your {{plan_name}} plan renews on {{renewal_date}}',
}

export default function SubscriptionRenewal(props: SubscriptionRenewalProps) {
  const { name, planName, amount, renewalDate, paymentMethod, manageUrl } = props
  return (
    <Layout
      preview={`Your ${planName} plan renews on ${renewalDate} for ${amount}.`}
      footerNote="You're receiving this because you have an active subscription."
    >
      <Title>Your subscription renews soon</Title>
      <P>
        Hi {name}, your {planName} plan renews automatically on {renewalDate}. You don't need to do anything to
        keep it.
      </P>
      <Details
        rows={[
          ['Plan', planName],
          ['Amount', amount],
          ['Renews on', renewalDate],
          ['Payment method', paymentMethod],
        ]}
      />
      <Button href={manageUrl}>Manage subscription</Button>
      <Small style={{ margin: 0 }}>
        To change plans or cancel, do it before {renewalDate} and you won't be charged for the next period.
      </Small>
    </Layout>
  )
}

SubscriptionRenewal.PreviewProps = {
  name: 'Ada',
  planName: 'Pro (annual)',
  amount: '$480.00',
  renewalDate: 'November 1, 2026',
  paymentMethod: 'Visa ending in 4242',
  manageUrl: 'https://example.com/billing',
} satisfies SubscriptionRenewalProps

export function text(props: SubscriptionRenewalProps) {
  const { name, planName, amount, renewalDate, paymentMethod, manageUrl } = props
  return plainText(
    'Your subscription renews soon',
    `Hi ${name}, your ${planName} plan renews automatically on ${renewalDate}. You don't need to do anything to keep it.`,
    textDetails([
      ['Plan', planName],
      ['Amount', amount],
      ['Renews on', renewalDate],
      ['Payment method', paymentMethod],
    ]),
    `Manage your subscription: ${manageUrl}`,
    `To change plans or cancel, do it before ${renewalDate} and you won't be charged for the next period.`,
  )
}

import * as React from 'react'
import { Button, Details, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText, textDetails } from '../../components/text'

export type PaymentFailedProps = {
  name: string
  planName: string
  amount: string
  paymentMethod: string
  retryDate: string
  updateUrl: string
}

export const meta: TemplateMeta = {
  name: 'Payment failed',
  description: 'Dunning email for a declined card: what failed, when it retries, and one fix button.',
  group: 'Billing',
  subject: 'Your payment didn’t go through',
}

export default function PaymentFailed(props: PaymentFailedProps) {
  const { name, planName, amount, paymentMethod, retryDate, updateUrl } = props
  return (
    <Layout
      preview={`We couldn't charge ${paymentMethod}. Update it before ${retryDate} to keep your plan.`}
      footerNote="You're receiving this because a payment for your subscription failed."
    >
      <Title>Your payment didn't go through</Title>
      <P>
        Hi {name}, we couldn't charge your {paymentMethod} for your {planName} plan. This usually happens when a
        card expires or the bank declines the charge.
      </P>
      <Details
        rows={[
          ['Plan', planName],
          ['Amount due', amount],
          ['Next attempt', retryDate],
        ]}
      />
      <P>Update your payment method before {retryDate} to keep your account active.</P>
      <Button href={updateUrl}>Update payment method</Button>
      <Small style={{ margin: 0 }}>Already updated your details? You can ignore this email.</Small>
    </Layout>
  )
}

PaymentFailed.PreviewProps = {
  name: 'Ada',
  planName: 'Pro',
  amount: '$54.13',
  paymentMethod: 'Visa ending in 4242',
  retryDate: 'October 19, 2026',
  updateUrl: 'https://example.com/billing/payment-method',
} satisfies PaymentFailedProps

export function text(props: PaymentFailedProps) {
  const { name, planName, amount, paymentMethod, retryDate, updateUrl } = props
  return plainText(
    "Your payment didn't go through",
    `Hi ${name}, we couldn't charge your ${paymentMethod} for your ${planName} plan. This usually happens when a card expires or the bank declines the charge.`,
    textDetails([
      ['Plan', planName],
      ['Amount due', amount],
      ['Next attempt', retryDate],
    ]),
    `Update your payment method before ${retryDate} to keep your account active:`,
    updateUrl,
    'Already updated your details? You can ignore this email.',
  )
}

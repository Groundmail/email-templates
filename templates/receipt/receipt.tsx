import * as React from 'react'
import { Button, Details, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText, textDetails } from '../../components/text'
import { theme } from '../../theme'

export type ReceiptItem = { description: string; amount: string }

export type ReceiptProps = {
  name: string
  receiptNumber: string
  paidAt: string
  paymentMethod: string
  items: ReceiptItem[]
  subtotal: string
  tax: string
  total: string
  receiptUrl: string
}

export const meta: TemplateMeta = {
  name: 'Receipt',
  description: 'A payment receipt with line items, tax, total and a link to the full invoice.',
  group: 'Billing',
  subject: `Your ${theme.brand.name} receipt #{{receipt_number}}`,
}

/**
 * Account templates only fill flat `{{variables}}`, so the hosted version has one
 * line item (`item_description`, `item_amount`). For several items, render this
 * component in your app and send the HTML, or send `items` with the React element.
 */
export const placeholders: Partial<ReceiptProps> = {
  items: [{ description: '{{item_description}}', amount: '{{item_amount}}' }],
}

export default function Receipt(props: ReceiptProps) {
  const { name, receiptNumber, paidAt, paymentMethod, items, subtotal, tax, total, receiptUrl } = props
  return (
    <Layout
      preview={`We received your payment of ${total}. Receipt #${receiptNumber}.`}
      footerNote="You're receiving this because you made a payment. Keep it for your records."
    >
      <Title>Thanks for your payment</Title>
      <P>
        Hi {name}, we received your payment of <strong>{total}</strong>. Here's your receipt.
      </P>
      <Details
        rows={[
          ['Receipt number', receiptNumber],
          ['Date paid', paidAt],
          ['Payment method', paymentMethod],
        ]}
      />
      <Details
        rows={[...items.map((item): [string, string] => [item.description, item.amount]), ['Subtotal', subtotal], ['Tax', tax]]}
        total={['Total paid', total]}
      />
      <Button href={receiptUrl}>View invoice</Button>
      <Small style={{ margin: 0 }}>Questions about this charge? Reply to this email and we'll help.</Small>
    </Layout>
  )
}

Receipt.PreviewProps = {
  name: 'Ada',
  receiptNumber: '2041-7730',
  paidAt: 'October 16, 2026',
  paymentMethod: 'Visa ending in 4242',
  items: [
    { description: 'Pro plan (monthly)', amount: '$40.00' },
    { description: 'Extra seats × 2', amount: '$10.00' },
  ],
  subtotal: '$50.00',
  tax: '$4.13',
  total: '$54.13',
  receiptUrl: 'https://example.com/billing/invoices/2041-7730',
} satisfies ReceiptProps

export function text(props: ReceiptProps) {
  const { name, receiptNumber, paidAt, paymentMethod, items, subtotal, tax, total, receiptUrl } = props
  return plainText(
    'Thanks for your payment',
    `Hi ${name}, we received your payment of ${total}. Here's your receipt.`,
    textDetails([
      ['Receipt number', receiptNumber],
      ['Date paid', paidAt],
      ['Payment method', paymentMethod],
    ]),
    textDetails([
      ...items.map((item): [string, string] => [item.description, item.amount]),
      ['Subtotal', subtotal],
      ['Tax', tax],
      ['Total paid', total],
    ]),
    `View invoice: ${receiptUrl}`,
    "Questions about this charge? Reply to this email and we'll help.",
  )
}

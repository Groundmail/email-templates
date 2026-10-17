import * as React from 'react'
import { Button, Callout, Layout, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'

export type AccountDeletionProps = {
  name: string
  deletionDate: string
  restoreUrl: string
}

export const meta: TemplateMeta = {
  name: 'Account deletion',
  description: 'Confirms a deletion request and offers a grace period to restore the account.',
  group: 'Account',
  subject: 'Your account is scheduled for deletion',
}

export default function AccountDeletion({ name, deletionDate, restoreUrl }: AccountDeletionProps) {
  return (
    <Layout
      preview={`We'll permanently delete your account on ${deletionDate}. You can restore it until then.`}
      footerNote="You're receiving this because a deletion was requested for your account."
    >
      <Title>Your account is scheduled for deletion</Title>
      <P>
        Hi {name}, as you asked, we'll permanently delete your account and all of its data on{' '}
        <strong>{deletionDate}</strong>.
      </P>
      <Callout>Changed your mind? You can restore your account any time before {deletionDate}.</Callout>
      <Button href={restoreUrl}>Restore my account</Button>
      <Small style={{ margin: 0 }}>
        After that date the deletion can't be undone. If you didn't ask to delete your account, restore it now
        and change your password.
      </Small>
    </Layout>
  )
}

AccountDeletion.PreviewProps = {
  name: 'Ada',
  deletionDate: 'November 15, 2026',
  restoreUrl: 'https://example.com/account/restore?token=71c0de',
} satisfies AccountDeletionProps

export function text({ name, deletionDate, restoreUrl }: AccountDeletionProps) {
  return plainText(
    'Your account is scheduled for deletion',
    `Hi ${name}, as you asked, we'll permanently delete your account and all of its data on ${deletionDate}.`,
    `Changed your mind? You can restore your account any time before ${deletionDate}:\n${restoreUrl}`,
    "After that date the deletion can't be undone. If you didn't ask to delete your account, restore it now and change your password.",
  )
}

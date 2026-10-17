import * as React from 'react'
import { Button, Divider, Layout, LinkFallback, P, Small, Title } from '../../components'
import type { TemplateMeta } from '../../components/meta'
import { plainText } from '../../components/text'

export type TeamInviteProps = {
  inviterName: string
  teamName: string
  role: string
  inviteUrl: string
  expiresIn: string
}

export const meta: TemplateMeta = {
  name: 'Team invite',
  description: 'Invites someone to a team or workspace, naming who sent it and the role they get.',
  group: 'Account',
  subject: '{{inviter_name}} invited you to join {{team_name}}',
}

export default function TeamInvite({ inviterName, teamName, role, inviteUrl, expiresIn }: TeamInviteProps) {
  return (
    <Layout
      preview={`${inviterName} invited you to join ${teamName}.`}
      footerNote="You're receiving this because someone invited this email address to their team."
    >
      <Title>Join {teamName}</Title>
      <P>
        <strong>{inviterName}</strong> invited you to join the <strong>{teamName}</strong> team with the{' '}
        {role} role.
      </P>
      <Button href={inviteUrl}>Accept invitation</Button>
      <Small>
        This invitation expires in {expiresIn}. If you weren't expecting it, you can ignore this email.
      </Small>
      <Divider />
      <LinkFallback href={inviteUrl} />
    </Layout>
  )
}

TeamInvite.PreviewProps = {
  inviterName: 'Grace Hopper',
  teamName: 'Analytical Engines',
  role: 'Editor',
  inviteUrl: 'https://example.com/invites/accept?token=9e33a0',
  expiresIn: '7 days',
} satisfies TeamInviteProps

export function text({ inviterName, teamName, role, inviteUrl, expiresIn }: TeamInviteProps) {
  return plainText(
    `Join ${teamName}`,
    `${inviterName} invited you to join the ${teamName} team with the ${role} role.`,
    `Accept the invitation: ${inviteUrl}`,
    `This invitation expires in ${expiresIn}. If you weren't expecting it, you can ignore this email.`,
  )
}

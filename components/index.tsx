import * as React from 'react'
import {
  Body,
  Button as EmailButton,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'
import { theme } from '../theme'
import { headCss, s } from './styles'

const light = theme.colors.light

type Children = { children?: React.ReactNode }

/** Page shell: color-scheme meta, dark-mode CSS, preheader, header, card and footer. */
export function Layout({
  preview,
  footerNote,
  children,
}: Children & { preview: string; footerNote?: React.ReactNode }) {
  const { brand } = theme
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{headCss()}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className="em-page" style={s.body}>
        <Container className="em-page" style={s.container}>
          <Section style={s.header}>
            <Link href={brand.websiteUrl} style={{ textDecoration: 'none' }}>
              {brand.logoUrl ? (
                <>
                  <Img
                    className="em-logo-light"
                    src={brand.logoUrl}
                    alt={brand.name}
                    height={brand.logoHeight}
                    style={{ height: `${brand.logoHeight}px`, width: 'auto', border: 0 }}
                  />
                  {brand.logoUrlDark ? (
                    <Img
                      className="em-logo-dark"
                      src={brand.logoUrlDark}
                      alt={brand.name}
                      height={brand.logoHeight}
                      style={{ height: `${brand.logoHeight}px`, width: 'auto', border: 0, display: 'none' }}
                    />
                  ) : null}
                </>
              ) : (
                <Text className="em-wordmark" style={s.wordmark}>
                  {brand.name}
                </Text>
              )}
            </Link>
          </Section>
          <Section className="em-card" style={s.card}>
            <Section className="em-card-body" style={s.cardBody}>
              {children}
            </Section>
          </Section>
          <Section style={s.footer}>
            {footerNote ? (
              <Text className="em-muted" style={s.footerText}>
                {footerNote}
              </Text>
            ) : null}
            {brand.address ? (
              <Text className="em-muted" style={s.footerText}>
                {brand.address}
              </Text>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function Title({ children }: Children) {
  return (
    <Heading as="h1" className="em-text em-h1" style={s.h1}>
      {children}
    </Heading>
  )
}

export function P({ children, style }: Children & { style?: React.CSSProperties }) {
  return (
    <Text className="em-text" style={{ ...s.p, ...style }}>
      {children}
    </Text>
  )
}

export function Small({ children, style }: Children & { style?: React.CSSProperties }) {
  return (
    <Text className="em-muted" style={{ ...s.small, ...style }}>
      {children}
    </Text>
  )
}

export function A({ href, children }: Children & { href: string }) {
  return (
    <Link className="em-link" href={href} style={s.link}>
      {children}
    </Link>
  )
}

/** Bulletproof button: a padded link, so it works in Outlook for Windows too. */
export function Button({
  href,
  tone = 'accent',
  children,
}: Children & { href: string; tone?: 'accent' | 'danger' }) {
  const danger = tone === 'danger'
  return (
    <Section style={{ margin: '8px 0 24px' }}>
      <EmailButton
        className={danger ? 'em-button-danger' : 'em-button'}
        href={href}
        style={{ ...s.button, ...(danger ? { backgroundColor: light.danger } : null) }}
      >
        {children}
      </EmailButton>
    </Section>
  )
}

/** "Button not working?" fallback with the raw URL, for clients that block buttons. */
export function LinkFallback({ href }: { href: string }) {
  return (
    <Small style={{ margin: '0 0 0', wordBreak: 'break-all' }}>
      If the button doesn't work, paste this link into your browser:
      <br />
      <A href={href}>{href}</A>
    </Small>
  )
}

export function Code({ children }: Children) {
  return (
    <Text className="em-text em-subtle" style={s.code}>
      {children}
    </Text>
  )
}

export function Callout({ children }: Children) {
  return (
    <Section className="em-subtle" style={s.callout}>
      <Text className="em-text" style={{ ...s.p, margin: 0, fontSize: '14px', lineHeight: '22px' }}>
        {children}
      </Text>
    </Section>
  )
}

export function Divider() {
  return <Hr className="em-rule" style={s.hr} />
}

/** Two-column label/value list: receipts, sign-in details, plan details. */
export function Details({
  rows,
  total,
}: {
  rows: Array<[React.ReactNode, React.ReactNode]>
  /** Optional emphasised last row, e.g. ['Total', '$49.00']. */
  total?: [React.ReactNode, React.ReactNode]
}) {
  const cell = { padding: '10px 0', fontSize: '14px', lineHeight: '20px', verticalAlign: 'top' as const }
  const border = { borderTop: `1px solid ${light.border}` }
  return (
    <Section style={{ margin: '0 0 24px' }}>
      {rows.map(([label, value], index) => (
        <Row key={index} className="em-border" style={index === 0 ? undefined : border}>
          <Column className="em-muted" style={{ ...cell, color: light.muted, width: '45%' }}>
            {label}
          </Column>
          <Column className="em-text" style={{ ...cell, color: light.text, textAlign: 'right' }}>
            {value}
          </Column>
        </Row>
      ))}
      {total ? (
        <Row className="em-strong-border" style={{ borderTop: `2px solid ${light.text}` }}>
          <Column className="em-text" style={{ ...cell, color: light.text, fontWeight: 650, paddingTop: '12px' }}>
            {total[0]}
          </Column>
          <Column
            className="em-text"
            style={{ ...cell, color: light.text, fontWeight: 650, textAlign: 'right', paddingTop: '12px' }}
          >
            {total[1]}
          </Column>
        </Row>
      ) : null}
    </Section>
  )
}

/** Horizontal usage bar, built from tables so Outlook for Windows draws it. `percent` may be a `{{placeholder}}`. */
export function Meter({ percent }: { percent: number | string }) {
  const width = typeof percent === 'number' ? `${Math.max(0, Math.min(100, percent))}%` : `${percent}%`
  const bar = { height: '8px', fontSize: '1px', lineHeight: '8px', borderRadius: '999px' }
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ margin: '4px 0 24px' }}>
      <tbody>
        <tr>
          <td className="em-track" style={{ ...bar, backgroundColor: light.subtle }}>
            <table role="presentation" width={width} cellPadding={0} cellSpacing={0} border={0} style={{ width }}>
              <tbody>
                <tr>
                  <td className="em-fill" style={{ ...bar, backgroundColor: light.accent }}>
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

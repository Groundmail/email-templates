/** "Send it" and "create it" snippets, shared by the per-template READMEs and the preview site. */

export const REPO = 'Groundmail/email-templates'
export const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`
export const API_BASE = 'https://api.groundmail.dev'
export const FROM = 'Acme <noreply@yourdomain.com>'
export const TO = 'ada@example.com'

export type SnippetInput = {
  slug: string
  name: string
  subject: string
  componentName: string
  variables: Record<string, string>
  /** React props for the `react:` example, each as `prop="value"` or `prop={value}` source. */
  reactProps: string[]
}

export type Snippet = { id: string; label: string; language: string; code: string }

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const dq = (s: string) => JSON.stringify(s)

function block(entries: Array<[string, string]>, indent: string, sep: string, quoteKey: (k: string) => string) {
  return entries.map(([k, v]) => `${indent}${quoteKey(k)}${sep}${v},`).join('\n')
}

export function pushSnippets({ slug, name, subject }: SnippetInput): Snippet[] {
  return [
    {
      id: 'push-npm',
      label: 'From a clone',
      language: 'bash',
      code: [
        '# 1. Edit theme.ts (name, logo, colors), then:',
        'npm install',
        'export GROUNDMAIL_API_KEY=gm_your_key_here',
        `npm run push -- ${slug}`,
      ].join('\n'),
    },
    {
      id: 'push-cli',
      label: 'CLI',
      language: 'bash',
      code: [
        `npx -y --package=groundmail-cli -- groundmail templates push templates/${slug}/${slug}.html \\`,
        `  --alias ${slug} \\`,
        `  --name ${dq(name)} \\`,
        `  --subject ${dq(subject)} \\`,
        `  --text templates/${slug}/${slug}.txt \\`,
        '  --publish',
      ].join('\n'),
    },
    {
      id: 'push-curl',
      label: 'No clone (API)',
      language: 'bash',
      code: [
        '# Creates the template with the default theme, then publishes it.',
        `curl -sL ${RAW_BASE}/templates/${slug}/groundmail.json \\`,
        `  | curl -X POST ${API_BASE}/templates \\`,
        '      -H "Authorization: Bearer $GROUNDMAIL_API_KEY" \\',
        '      -H "Content-Type: application/json" \\',
        '      --data-binary @-',
        '',
        `curl -X POST ${API_BASE}/templates/${slug} \\`,
        '  -H "Authorization: Bearer $GROUNDMAIL_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        `  -d '{"action":"publish"}'`,
      ].join('\n'),
    },
  ]
}

export function sendSnippets(input: SnippetInput): Snippet[] {
  const { slug, subject, componentName, variables, reactProps } = input
  const vars = Object.entries(variables)
  const node = [
    "import { Groundmail } from 'groundmail'",
    '',
    'const groundmail = new Groundmail(process.env.GROUNDMAIL_API_KEY!)',
    '',
    'await groundmail.emails.send({',
    `  from: ${q(FROM)},`,
    `  to: ${q(TO)},`,
    '  template: {',
    `    id: ${q(slug)},`,
    '    variables: {',
    block(vars.map(([k, v]) => [k, q(v)]), '      ', ': ', (k) => k),
    '    },',
    '  },',
    '})',
  ].join('\n')

  const react = [
    "import { Groundmail } from 'groundmail'",
    `import ${componentName} from './templates/${slug}/${slug}'`,
    '',
    'const groundmail = new Groundmail(process.env.GROUNDMAIL_API_KEY!)',
    '',
    '// Renders the component with @react-email/render, then sends the HTML.',
    'await groundmail.emails.send({',
    `  from: ${q(FROM)},`,
    `  to: ${q(TO)},`,
    `  subject: ${q(subject.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => variables[k] ?? k))},`,
    '  react: (',
    `    <${componentName}`,
    ...reactProps.map((prop) => `      ${prop}`),
    '    />',
    '  ),',
    '})',
  ].join('\n')

  const python = [
    'import os',
    'from groundmail import Groundmail',
    '',
    'groundmail = Groundmail(os.environ["GROUNDMAIL_API_KEY"])',
    '',
    'groundmail.emails.send(',
    `    from_=${dq(FROM)},`,
    `    to=${dq(TO)},`,
    '    template={',
    `        "id": ${dq(slug)},`,
    '        "variables": {',
    block(vars.map(([k, v]) => [k, dq(v)]), '            ', ': ', dq),
    '        },',
    '    },',
    ')',
  ].join('\n')

  const php = [
    '<?php',
    '',
    "$groundmail = new Groundmail\\Client(getenv('GROUNDMAIL_API_KEY'));",
    '',
    '$groundmail->emails->send([',
    `    'from' => ${q(FROM)},`,
    `    'to' => ${q(TO)},`,
    "    'template' => [",
    `        'id' => ${q(slug)},`,
    "        'variables' => [",
    block(vars.map(([k, v]) => [k, q(v)]), '            ', ' => ', q),
    '        ],',
    '    ],',
    ']);',
  ].join('\n')

  const body = JSON.stringify({ from: FROM, to: TO, template: { id: slug, variables } }, null, 2)
  const curl = [
    `curl -X POST ${API_BASE}/emails \\`,
    '  -H "Authorization: Bearer $GROUNDMAIL_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    `  -d '${body.replace(/'/g, "'\\''")}'`,
  ].join('\n')

  return [
    { id: 'node', label: 'Node.js', language: 'typescript', code: node },
    { id: 'react', label: 'React Email', language: 'typescript', code: react },
    { id: 'python', label: 'Python', language: 'python', code: python },
    { id: 'php', label: 'PHP', language: 'php', code: php },
    { id: 'curl', label: 'cURL', language: 'bash', code: curl },
  ]
}

export const INSTALL: Record<string, string> = {
  node: 'npm install groundmail',
  react: 'npm install groundmail @react-email/render react',
  python: 'pip install groundmail',
  php: 'composer require groundmail/groundmail',
}

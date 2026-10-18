const templates = window.__TEMPLATES__
const GROUPS = ['Authentication', 'Account', 'Billing']
const REPO = 'https://github.com/Groundmail/email-templates/blob/main/templates'
const TABS = ['preview', 'tsx', 'mjml', 'html', 'text', 'send']
const CODE = {
  tsx: { ext: 'tsx', lang: 'typescript', key: 'tsx' },
  mjml: { ext: 'mjml', lang: 'xml', key: 'mjml' },
  html: { ext: 'html', lang: 'xml', key: 'html' },
  text: { ext: 'txt', lang: 'plaintext', key: 'text' },
}

const $ = (id) => document.getElementById(id)
const cache = new Map()
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const state = {
  slug: null,
  tab: 'preview',
  scheme: prefersDark.matches ? 'dark' : 'light',
  device: 'desktop',
  source: 'react',
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value
    else if (key === 'text') node.textContent = value
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value)
    else node.setAttribute(key, value)
  }
  for (const child of children) if (child) node.append(child)
  return node
}

function highlight(code, lang) {
  if (window.hljs && lang !== 'plaintext') {
    try {
      return window.hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch {}
  }
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

async function copy(text, button) {
  try {
    await navigator.clipboard.writeText(text)
    const label = button.textContent
    button.textContent = 'Copied'
    button.classList.add('done')
    setTimeout(() => {
      button.textContent = label
      button.classList.remove('done')
    }, 1400)
  } catch {
    button.textContent = 'Press ⌘C'
  }
}

async function load(slug) {
  if (!cache.has(slug)) cache.set(slug, fetch(`data/${slug}.json`).then((r) => r.json()))
  return cache.get(slug)
}

/**
 * Pin the preview to the chosen scheme, whatever the viewer's OS is set to:
 * dark forces the prefers-color-scheme block on, light switches it off.
 */
function forScheme(html, scheme) {
  return html
    .replace('<head>', '<head><base target="_blank" />')
    .replace(/@media \(prefers-color-scheme: dark\)/g, scheme === 'dark' ? '@media all' : '@media not all')
    .replace(/color-scheme: light dark/g, `color-scheme: ${scheme}`)
    .replace(/(<meta name="(?:supported-)?color-scheme" content=")light dark(")/g, `$1${scheme}$2`)
}

function grouped() {
  return GROUPS.map((group) => [group, templates.filter((t) => t.group === group)])
}

function renderGallery() {
  const grid = $('grid')
  grid.replaceChildren()
  for (const [group, items] of grouped()) {
    grid.append(el('h2', { class: 'group-title', text: group }))
    const row = el('div', { class: 'cards' })
    for (const t of items) {
      const frame = el('iframe', {
        src: `previews/${t.slug}.html`,
        loading: 'lazy',
        tabindex: '-1',
        title: `${t.name} preview`,
        sandbox: 'allow-same-origin',
        'aria-hidden': 'true',
      })
      row.append(
        el(
          'a',
          { class: 'card', href: `#${t.slug}` },
          el('div', { class: 'thumb' }, frame),
          el('div', { class: 'card-body' }, el('h3', { text: t.name }), el('p', { text: t.description })),
        ),
      )
    }
    grid.append(row)
  }
}

function renderNav() {
  const nav = $('nav')
  const picker = $('picker')
  nav.replaceChildren()
  picker.replaceChildren()
  for (const [group, items] of grouped()) {
    nav.append(el('p', { class: 'nav-group', text: group }))
    const optgroup = el('optgroup', { label: group })
    for (const t of items) {
      nav.append(el('a', { href: `#${t.slug}`, 'data-slug': t.slug, text: t.name }))
      optgroup.append(el('option', { value: t.slug, text: t.name }))
    }
    picker.append(optgroup)
  }
  picker.addEventListener('change', () => (location.hash = picker.value))
}

function snippetTabs(container, snippets, install) {
  container.replaceChildren()
  const head = el('div', { class: 'snippet-tabs' })
  const body = el('div', { class: 'snippet-body' })
  const show = (index) => {
    const s = snippets[index]
    head.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === index))
    const pre = el('pre', { class: 'code' }, el('code'))
    pre.firstChild.innerHTML = highlight(s.code, s.language)
    const copyButton = el('button', { class: 'copy', text: 'Copy', onclick: (e) => copy(s.code, e.currentTarget) })
    const parts = [el('div', { class: 'code-head' }, el('span', { class: 'file', text: s.label }), copyButton)]
    if (install && install[s.id]) {
      parts.push(el('pre', { class: 'install' }, el('code', { text: install[s.id] })))
    }
    parts.push(pre)
    body.replaceChildren(...parts)
  }
  snippets.forEach((s, i) => head.append(el('button', { text: s.label, onclick: () => show(i) })))
  container.append(head, body)
  show(0)
}

const INSTALL = {
  node: 'npm install groundmail',
  react: 'npm install groundmail @react-email/render react',
  python: 'pip install groundmail',
  php: 'composer require groundmail/groundmail',
}

function syncSegments() {
  document.querySelectorAll('.seg').forEach((seg) => {
    const key = seg.dataset.group
    seg.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.value === state[key]))
  })
}

async function renderDetail() {
  const meta = templates.find((t) => t.slug === state.slug)
  $('t-name').textContent = meta.name
  $('t-desc').textContent = meta.description
  $('t-subject').textContent = meta.subject
  document.title = `${meta.name} email template · React Email, MJML, HTML`
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.slug === meta.slug))
  $('picker').value = meta.slug
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === state.tab)
    b.setAttribute('aria-selected', String(b.dataset.tab === state.tab))
  })

  const t = await load(state.slug)
  if (t.slug !== state.slug) return

  $('pane-preview').hidden = state.tab !== 'preview'
  $('pane-code').hidden = !CODE[state.tab]
  $('pane-send').hidden = state.tab !== 'send'

  if (state.tab === 'preview') {
    syncSegments()
    $('stage').dataset.device = state.device
    $('stage').dataset.scheme = state.scheme
    $('frame').srcdoc = forScheme(t.previews[state.source], state.scheme)
  } else if (CODE[state.tab]) {
    const c = CODE[state.tab]
    const source = t.sources[c.key]
    const file = `${t.slug}.${c.ext}`
    $('code-file').textContent = `templates/${t.slug}/${file}`
    $('code-github').href = `${REPO}/${t.slug}/${file}`
    $('code').innerHTML = highlight(source, c.lang)
    document.querySelector('[data-copy="code"]').onclick = (e) => copy(source, e.currentTarget)
  } else {
    document.querySelectorAll('.alias').forEach((n) => (n.textContent = t.slug))
    snippetTabs($('push'), t.snippets.push)
    snippetTabs($('send'), t.snippets.send, INSTALL)
    $('vars').replaceChildren(
      ...t.variables.map((v) =>
        el(
          'tr',
          {},
          el('td', {}, el('code', { text: `{{${v.name}}}` })),
          el('td', {}, el('code', { text: v.prop })),
          el('td', { text: v.example }),
        ),
      ),
    )
  }
}

function route() {
  const [slug, tab] = location.hash.replace(/^#/, '').split('/')
  const known = templates.some((t) => t.slug === slug)
  $('gallery').hidden = known
  $('detail').hidden = !known
  if (!known) {
    document.title = 'Transactional Email Templates · React Email, MJML, HTML'
    state.slug = null
    return
  }
  const changed = state.slug !== slug
  state.slug = slug
  state.tab = TABS.includes(tab) ? tab : 'preview'
  if (changed) window.scrollTo(0, 0)
  renderDetail()
}

document.querySelectorAll('#tabs button').forEach((b) =>
  b.addEventListener('click', () => {
    location.hash = b.dataset.tab === 'preview' ? state.slug : `${state.slug}/${b.dataset.tab}`
  }),
)
document.querySelectorAll('.seg').forEach((seg) =>
  seg.addEventListener('click', (e) => {
    const value = e.target.dataset && e.target.dataset.value
    if (!value) return
    state[seg.dataset.group] = value
    renderDetail()
  }),
)

renderGallery()
renderNav()
window.addEventListener('hashchange', route)
route()

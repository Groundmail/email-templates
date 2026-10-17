/**
 * npm run dev: the React Email preview server with just the 12 components.
 *
 * Pointing `email dev` at templates/ would also list every generated .html file,
 * so this re-exports each component from a scratch folder and serves that instead.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { SLUGS } from './registry'

const ROOT = path.resolve(import.meta.dirname, '..')
const dir = path.join(ROOT, '.preview-emails')
fs.rmSync(dir, { recursive: true, force: true })
fs.mkdirSync(dir)
for (const slug of SLUGS) {
  fs.writeFileSync(path.join(dir, `${slug}.tsx`), `export { default } from '../templates/${slug}/${slug}'\n`)
}

const child = spawn('email', ['dev', '--dir', '.preview-emails', ...process.argv.slice(2)], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
child.on('exit', (code) => process.exit(code ?? 0))

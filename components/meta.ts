export type TemplateGroup = 'Authentication' | 'Account' | 'Billing'

export type TemplateMeta = {
  /** Display name, also the template name created in your account by `npm run push`. */
  name: string
  description: string
  group: TemplateGroup
  /** Subject line. `{{variable}}` placeholders are filled at send time. */
  subject: string
}

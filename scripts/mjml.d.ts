declare module 'mjml' {
  type MjmlError = { line: number; message: string; tagName: string; formattedMessage: string }
  type MjmlOptions = { validationLevel?: 'strict' | 'soft' | 'skip'; keepComments?: boolean; minify?: boolean }
  export default function mjml2html(input: string, options?: MjmlOptions): Promise<{ html: string; errors: MjmlError[] }>
}

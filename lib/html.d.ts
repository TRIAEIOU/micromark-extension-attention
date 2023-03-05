/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 *
 * @typedef Options
 * @property {string} mdastNodeName
 * @property {string} hastNodeName
 */
/**
 * HTML extension genrator for micromark (passed in `htmlExtensions`).
 * @param {Options} options
 * @return HtmlExtension
 */
export function attentionHtml(options: Options): {
  enter: Record<string, () => void>
  exit: Record<string, () => void>
}
export type HtmlExtension = import('micromark-util-types').HtmlExtension
export type Options = {
  mdastNodeName: string
  hastNodeName: string
}

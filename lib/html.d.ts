/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').Handles} Handles
 *
 * @typedef Configuration
 *   Configuration for emphasis type to generate.
 * @property {string} mdastNode
 *   Mdast node name
 * @property {string} htmlNode
 *   HTML node (tag) name, eg 'sup' for a '<sup>' tag
 */
/**
 * Generates HTML extension for micromark (passed in `htmlExtensions`).
 * @param {Configuration} cfg
 * @returns {HtmlExtension}
 */
export function inlineFactoryHtml(cfg: Configuration): HtmlExtension
export type HtmlExtension = import('micromark-util-types').HtmlExtension
export type Handles = import('micromark-util-types').Handles
/**
 * Configuration for emphasis type to generate.
 */
export type Configuration = {
  /**
   * Mdast node name
   */
  mdastNode: string
  /**
   * HTML node (tag) name, eg 'sup' for a '<sup>' tag
   */
  htmlNode: string
}

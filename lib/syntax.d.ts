/**
 * Function that can be called to get a syntax extension for micromark (passed
 * in `extensions`).
 *
 * @param {Configuration} cfg
 *   Configuration
 * @returns {Extension}
 *   Syntax extension for micromark (passed in `extensions`).
 */
export function inlineFactory(cfg: Configuration): Extension
export type Extension = import('micromark-util-types').Extension
export type Resolver = import('micromark-util-types').Resolver
export type Tokenizer = import('micromark-util-types').Tokenizer
export type State = import('micromark-util-types').State
export type Code = import('micromark-util-types').Code
/**
 * Configuration for emphasis type to generate.
 */
export type Configuration = {
  /**
   * Character code for one or the symbols
   */
  code: Code
  /**
   * Mdast node name
   */
  mdastNode: string
  /**
   * Hast node/HTML tag name
   */
  htmlNode: string
  /**
   * Internal unique denominator
   */
  sequence: string
  /**
   * Internal unique denominator
   */
  tempSequence: string
  /**
   * Internal unique denominator
   */
  typeText: string
  /**
   * Length of symbol(s), e.g. 2 for '~~'
   */
  symbolLen: number
}

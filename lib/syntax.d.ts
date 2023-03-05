/**
 * Function that can be called to get a syntax extension for micromark (passed
 * in `extensions`).
 *
 * @param {Options} options
 *   MDAST and HAST node names
 * @returns {Extension}
 *   Syntax extension for micromark (passed in `extensions`).
 */
export function attention(options: Options): Extension
export {codes} from 'micromark-util-symbol/codes.js'
export type Extension = import('micromark-util-types').Extension
export type Resolver = import('micromark-util-types').Resolver
export type Tokenizer = import('micromark-util-types').Tokenizer
export type State = import('micromark-util-types').State
export type Code = import('micromark-util-types').Code
export type Options = {
  mdastNodeName: string
  hastNodeName: string
  code: Code
}

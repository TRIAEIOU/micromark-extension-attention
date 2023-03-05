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
export function attentionHtml(options) {
  return {
    enter: {
      [options.mdastNodeName]() {
        // @ts-expect-error Custom
        this.tag(`<${options.hastNodeName}>`);
      }

    },
    exit: {
      [options.mdastNodeName]() {
        // @ts-expect-error Custom
        this.tag(`</${options.hastNodeName}>`);
      }

    }
  };
}
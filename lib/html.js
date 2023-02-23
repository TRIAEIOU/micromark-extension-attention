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
export function inlineFactoryHtml(cfg) {
  /** @type {{enter: Handles, exit: Handles}} */
  const temporary = {
    enter: {},
    exit: {}
  };

  temporary.enter[cfg.mdastNode] = function () {
    this.tag(`<${cfg.htmlNode}>`);
  };

  temporary.exit[cfg.mdastNode] = function () {
    this.tag(`</${cfg.htmlNode}>`);
  };

  return temporary;
}
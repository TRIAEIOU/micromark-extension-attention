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
    enter: {
        [x: string]: () => void;
    };
    exit: {
        [x: string]: () => void;
    };
};
export type HtmlExtension = import('micromark-util-types').HtmlExtension;
export type Options = {
    mdastNodeName: string;
    hastNodeName: string;
};

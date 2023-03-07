# micromark-extension-attention

Create single char emphasis style markers, e.g. underline. Requires [mdast-util-attention](https://github.com/TRIAEIOU/mdast-util-attention).

## Modifcations from micromark-extension-gfm-strikthrough

- Create branch "attention"
- html.js:
  - Parameterize gfmStrikethroughHtml to attentionHtml({mdastNodeName: str, hastNodeName: str})
  - Replace tag and function names
- Syntax.js:
  - Prefer using char rather than char code, char code is only needed here so convert char from charCodeAt(0)
  - Parameterize gfmStrikethrough to attention({mdastNodeName: str, hastNodeName: str, char: str})
    - Convert single-or-double checks to single only.
    - Find all `*strikethrough*` strings and convert to constants set to relevant strings from opts
- test.js:
  - Convert test cases, move fixture files into .ignore subfolder
- Run task `npm build`
- Push

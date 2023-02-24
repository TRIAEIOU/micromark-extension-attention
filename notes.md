# Modifcations from micromark-extension-gfm-strikthrough

- Create branch "attention"
- html.js:
  - Parameterize gfmStrikethroughHtml to attentionHtml({mdastNodeName: str, hastNodeName: str})
  - Replace tag and function names
- Syntax.js:
  - Export typedef `codes`
  - Parameterize gfmStrikethrough to attention({mdastNodeName: str, hastNodeName: str, code: Code})
    - Convert single-or-double checks to single only.
    - Find all `*strikethrough*` strings and convert to constants set to relevant strings from opts
- test.js:
  - Convert test cases, move fixture files into .ignore subfolder
- Run task `npm build`
- Push

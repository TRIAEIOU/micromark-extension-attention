/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Code} Code
 *
 * @typedef Configuration
 *   Configuration for emphasis type to generate.
 * @property {Code} code
 *   Character code for one or the symbols
 * @property {string} mdastNode
 *   Mdast node name
 * @property {string} htmlNode
 *   Hast node/HTML tag name
 * @property {string} sequence
 *   Internal unique denominator
 * @property {string} tempSequence
 *   Internal unique denominator
 * @property {string} typeText
 *   Internal unique denominator
 * @property {number} symbolLen
 *   Length of symbol(s), e.g. 2 for '~~'
 */
import {splice} from 'micromark-util-chunked'
import {classifyCharacter} from 'micromark-util-classify-character'
import {resolveAll} from 'micromark-util-resolve-all'

/**
 * Function that can be called to get a syntax extension for micromark (passed
 * in `extensions`).
 *
 * @param {Configuration} cfg
 *   Configuration
 * @returns {Extension}
 *   Syntax extension for micromark (passed in `extensions`).
 */
export function inlineFactory(cfg) {
  const {code, mdastNode, sequence, tempSequence, typeText, symbolLen} = {
    ...cfg
  }
  const tokenizer = {
    tokenize: tokenizeInline,
    resolveAll: resolveAllInline
  }
  return {
    text: {
      [Number(code)]: tokenizer
    },
    insideSpan: {
      null: [tokenizer]
    },
    attentionMarkers: {
      null: [code]
    }
  }
  /**
   * Take events and resolve strikethrough.
   *
   * @type {Resolver}
   */

  function resolveAllInline(events, context) {
    let index = -1 // Walk through all events.

    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === tempSequence &&
        events[index][1]._close
      ) {
        let open = index // Now walk back to find an opener.

        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === tempSequence &&
            events[open][1]._open && // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = sequence
            events[open][1].type = sequence
            const inline = {
              type: mdastNode,
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end)
            }
            const text = {
              type: typeText,
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start)
            } // Opening.

            const nextEvents = [
              ['enter', inline, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context]
            ] // Between.

            splice(
              nextEvents,
              nextEvents.length,
              0,
              resolveAll(
                context.parser.constructs.insideSpan.null,
                events.slice(open + 1, index),
                context
              )
            ) // Closing.

            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', inline, context]
            ])
            splice(events, open - 1, index - open + 3, nextEvents)
            index = open + nextEvents.length - 2
            break
          }
        }
      }
    }

    index = -1

    while (++index < events.length) {
      if (events[index][1].type === tempSequence) {
        events[index][1].type = 'data'
      }
    }

    return events
  }
  /** @type {Tokenizer} */

  function tokenizeInline(effects, ok, nok) {
    const previous = this.previous
    const events = this.events
    let size = 0
    return start
    /** @type {State} */

    function start(_code) {
      if (
        previous === _code &&
        events[events.length - 1][1].type !== 'characterEscape'
      ) {
        return nok(_code)
      }

      effects.enter(tempSequence)
      return more(_code)
    }
    /** @type {State} */

    function more(_code) {
      const before = classifyCharacter(previous)

      if (_code === code) {
        if (size >= symbolLen) return nok(_code)
        effects.consume(_code)
        size++
        return more
      }

      if (size < symbolLen) return nok(_code)
      const token = effects.exit(tempSequence)
      const after = classifyCharacter(_code)
      token._open = !after || (after === 2 && Boolean(before))
      token._close = !before || (before === 2 && Boolean(after))
      return ok(_code)
    }
  }
}

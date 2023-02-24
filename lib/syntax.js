/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Code} Code
 *
 * @typedef Options
 * @property {string} mdastNodeName
 * @property {string} hastNodeName
 * @property {Code} code
 */
import { splice } from 'micromark-util-chunked';
import { classifyCharacter } from 'micromark-util-classify-character';
import { resolveAll } from 'micromark-util-resolve-all';
export { codes } from 'micromark-util-symbol/codes.js';
/**
 * Function that can be called to get a syntax extension for micromark (passed
 * in `extensions`).
 *
 * @param {Options} options
 *   MDAST and HAST node names
 * @returns {Extension}
 *   Syntax extension for micromark (passed in `extensions`).
 */

export function attention(options) {
  const atn = options.mdastNodeName;
  const atnTxt = `${atn}Text`;
  const atnSeq = `${options.mdastNodeName}Sequence`;
  const atnSeqTemporary = `${atnSeq}Temporary`;
  const tokenizer = {
    tokenize: tokenizeAttention,
    resolveAll: resolveAllAttention
  };
  return {
    // @ts-ignore Number
    text: {
      [options.code]: tokenizer
    },
    insideSpan: {
      null: [tokenizer]
    },
    //
    attentionMarkers: {
      null: [options.code]
    }
  };
  /**
   * Take events and resolve attention.
   *
   * @type {Resolver}
   */

  function resolveAllAttention(events, context) {
    let index = -1; // Walk through all events.

    while (++index < events.length) {
      // Find a token that can close.
      if (events[index][0] === 'enter' && events[index][1].type === atnSeqTemporary && events[index][1]._close) {
        let open = index; // Now walk back to find an opener.

        while (open--) {
          // Find a token that can open the closer.
          if (events[open][0] === 'exit' && events[open][1].type === atnSeqTemporary && events[open][1]._open && // If the sizes are the same:
          events[index][1].end.offset - events[index][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
            events[index][1].type = atnSeq;
            events[open][1].type = atnSeq;
            const attention = {
              type: atn,
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end)
            };
            const text = {
              type: atnTxt,
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start)
            }; // Opening.

            const nextEvents = [['enter', attention, context], ['enter', events[open][1], context], ['exit', events[open][1], context], ['enter', text, context]]; // Between.

            splice(nextEvents, nextEvents.length, 0, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context)); // Closing.

            splice(nextEvents, nextEvents.length, 0, [['exit', text, context], ['enter', events[index][1], context], ['exit', events[index][1], context], ['exit', attention, context]]);
            splice(events, open - 1, index - open + 3, nextEvents);
            index = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }

    index = -1;

    while (++index < events.length) {
      if (events[index][1].type === atnSeqTemporary) {
        events[index][1].type = "data";
      }
    }

    return events;
  }
  /** @type {Tokenizer} */


  function tokenizeAttention(effects, ok, nok) {
    // @ts-ignore Custom
    const previous = this.previous; // @ts-ignore Custom

    const events = this.events;
    let size = 0;
    return start;
    /** @type {State} */

    function start(code) {
      if (previous === options.code && events[events.length - 1][1].type !== "characterEscape") {
        return nok(code);
      }

      effects.enter(atnSeqTemporary);
      return more(code);
    }
    /** @type {State} */


    function more(code) {
      const before = classifyCharacter(previous);

      if (code === options.code) {
        // If this is the second marker, exit.
        if (size) return nok(code);
        effects.consume(code);
        size++;
        return more;
      }

      const token = effects.exit(atnSeqTemporary);
      const after = classifyCharacter(code);
      token._open = !after || after === 2 && Boolean(before);
      token._close = !before || before === 2 && Boolean(after);
      return ok(code);
    }
  }
}
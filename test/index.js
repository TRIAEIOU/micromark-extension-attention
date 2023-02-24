import {URL} from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {micromark} from 'micromark'
import {createGfmFixtures} from 'create-gfm-fixtures'
import {attention, attentionHtml, codes} from '../dev/index.js'

const cfg = {
  mdastNodeName: 'superscript',
  hastNodeName: 'sup',
  code: codes.caret
}

test('markdown -> html (micromark)', (t) => {
  const defaults = attention(cfg)
  const html = attentionHtml(cfg)

  t.deepEqual(
    micromark('a ^b^', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <sup>b</sup></p>',
    'should support single symbol'
  )

  t.deepEqual(
    micromark('a ^^b^^', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a ^^b^^</p>',
    'should not support double symbol'
  )

  t.deepEqual(
    micromark('a ^^^b^^^', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a ^^^b^^^</p>',
    'should not support triple symbol'
  )

  t.deepEqual(
    micromark('a \\^^b^ c', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a ^<sup>b</sup> c</p>',
    'should support attention w/ after an escaped symbol'
  )

  t.deepEqual(
    micromark('a ^b ^c^ d^ e', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <sup>b <sup>c</sup> d</sup> e</p>',
    'should support nested attention'
  )

  t.deepEqual(
    micromark('a ^-1^ b', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <sup>-1</sup> b</p>',
    'should open if preceded by whitespace and followed by punctuation'
  )

  t.deepEqual(
    micromark('a ^b.^ c', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <sup>b.</sup> c</p>',
    'should close if preceded by punctuation and followed by whitespace'
  )

  t.end()
})

test('fixtures', async (t) => {
  const base = new URL('fixtures/', import.meta.url)

  await createGfmFixtures(base, {rehypeStringify: {closeSelfClosing: true}})

  const files = fs.readdirSync(base).filter((d) => /\.md$/.test(d))
  let index = -1

  while (++index < files.length) {
    const name = path.basename(files[index], '.md')
    const input = fs.readFileSync(new URL(name + '.md', base))
    const expected = String(fs.readFileSync(new URL(name + '.html', base)))
    let actual = micromark(input, {
      extensions: [attention(cfg)],
      htmlExtensions: [attentionHtml(cfg)]
    })

    if (actual && !/\n$/.test(actual)) {
      actual += '\n'
    }

    t.deepEqual(actual, expected, name)
  }

  t.end()
})

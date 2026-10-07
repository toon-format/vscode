import { readdir, readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma'
import { INITIAL, parseRawGrammar, Registry } from 'vscode-textmate'

const grammarUrl = new URL('../syntaxes/toon.tmLanguage.json', import.meta.url)
const specDir = new URL('./', import.meta.resolve('@toon-format/spec/package.json'))
const fixtureDir = new URL('tests/fixtures/decode/', specDir)
const examplesDir = new URL('examples/', specDir)

await loadWASM(await readFile(new URL(import.meta.resolve('vscode-oniguruma/release/onig.wasm'))))
const registry = new Registry({
  onigLib: Promise.resolve({
    createOnigScanner: patterns => new OnigScanner(patterns),
    createOnigString: text => new OnigString(text),
  }),
  loadGrammar: async () => parseRawGrammar(await readFile(grammarUrl, 'utf-8'), grammarUrl.pathname),
})
const grammar = (await registry.loadGrammar('source.toon'))!
const fixtureFiles = (await readdir(fixtureDir)).filter(file => file.endsWith('.json'))
const examples = (await readdir(examplesDir, { recursive: true }))
  .filter(file => /^(?:valid|conversions)\/.*\.toon$/.test(file))
  .sort()

/** Tokenizes a document and returns `[text, innermost scope]` pairs per line. */
function tokenize(source: string): [string, string][][] {
  let ruleStack = INITIAL
  return source.split('\n').map((line) => {
    const result = grammar.tokenizeLine(line, ruleStack)
    ruleStack = result.ruleStack
    return result.tokens.map(token => [line.slice(token.startIndex, token.endIndex), token.scopes.at(-1)!])
  })
}

/** Returns the scope of `text` on the last line of `source`. */
function scopeOf(source: string, text: string): string | undefined {
  return tokenize(source).at(-1)!.find(([tokenText]) => tokenText === text)?.[1]
}

describe('grammar', () => {
  it.each([
    ['name: "a # b"', 'a # b', 'string.quoted.double.toon'],
    ['note: x #tag', 'x #tag', 'string.unquoted.toon'],
    ['"a:b"[2]: 1,2', '"a:b"', 'support.type.property-name.toon'],
    ['  - key[2]{a,b}:', 'key', 'support.type.property-name.toon'],
    ['-  key[1]: x', 'key', 'support.type.property-name.toon'],
    ['a[2:]{x}', 'a[2:]{x}', 'string.unquoted.toon'],
    // Whitespace is SP and HTAB only, so an NBSP is part of the key
    ['n [1]: y', 'n ', 'support.type.property-name.toon'],
    ['[2:|]{a|b}:', 'b', 'support.type.property-name.field.toon'],
    ['a:b[2]: x', 'a', 'support.type.property-name.toon'],
    ['foo-bar: 1', 'foo-bar', 'support.type.property-name.toon'],
    [': 1', ':', 'punctuation.separator.key-value.toon'],
    ['m[1:]{v}:\n  : 4', ':', 'punctuation.separator.key-value.toon'],
    // The value token is trimmed, so the space after the colon is optional
    ['a:30', '30', 'constant.numeric.toon'],
    ['a:true', 'true', 'constant.language.toon'],
    ['n[4]: 1e5,-0,.5,05', '1e5', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '-0', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '.5', 'string.unquoted.toon'],
    ['n[4]: 1e5,-0,.5,05', '05', 'string.unquoted.toon'],
    ['n: +1', '+1', 'string.unquoted.toon'],
    // Only the active delimiter splits, and only inline arrays and rows
    ['n: a,b|c', 'a,b|c', 'string.unquoted.toon'],
    ['x[2|]: a,b|c', 'a,b', 'string.unquoted.toon'],
    ['- t[1|]{a|b}:\n    x,y|z', 'x,y', 'string.unquoted.toon'],
    ['- t[1|]{a|b}:\n    x|y\n  k: a|b', 'a|b', 'string.unquoted.toon'],
    // `[]` is a string inside inline arrays and rows
    ['tags[1]: []', '[]', 'string.unquoted.toon'],
    ['- []', '[]', 'constant.language.empty-array.toon'],
    ['k: "\\u00e9"', '\\u00e9', 'constant.character.escape.toon'],
    ['k: "\\/"', '\\/', 'invalid.illegal.unrecognized-string-escape.toon'],
    ['"a\\/b": 1', '\\/', 'invalid.illegal.unrecognized-string-escape.toon'],
    ['t[1]{"a\\nb"}:', '\\n', 'constant.character.escape.toon'],
    ['q: "abc', '"abc', 'invalid.illegal.unterminated-string.toon'],
  ])('%s → %s', (source, text, scope) => {
    expect(scopeOf(source, text)).toBe(scope)
  })
})

describe('spec decode fixtures', () => {
  it.each(fixtureFiles)('%s: comment scope matches the comment lines exactly', async (file) => {
    const { tests } = JSON.parse(await readFile(new URL(file, fixtureDir), 'utf-8')) as { tests: { input: string }[] }
    for (const { input } of tests) {
      const lines = input.split('\n')
      tokenize(input).forEach((tokens, index) => {
        const isComment = /^ *#/.test(lines[index]!)
        const hasCommentScope = tokens.some(([, scope]) => scope.startsWith('comment.') || scope.startsWith('punctuation.definition.comment'))
        expect(hasCommentScope, JSON.stringify(lines[index])).toBe(isComment)
      })
    }
  })
})

describe('spec examples', () => {
  it.each(examples)('%s', async (example) => {
    const source = (await readFile(new URL(example, examplesDir), 'utf-8')).trimEnd()
    const lines = source.split('\n')
    const snapshot = tokenize(source).map((tokens, index) => {
      const scoped = tokens
        .filter(([text, scope]) => scope !== 'source.toon' || text.trim() !== '')
        .map(([text, scope]) => `  ${JSON.stringify(text)} ${scope}`)
      return [`> ${lines[index]}`, ...scoped].join('\n')
    })
    await expect(`${snapshot.join('\n')}\n`).toMatchFileSnapshot(`__snapshots__/${example}.txt`)
  })
})

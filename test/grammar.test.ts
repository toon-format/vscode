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

function scopeOf(line: string, text: string): string | undefined {
  return tokenize(line)[0]!.find(([tokenText]) => tokenText === text)?.[1]
}

describe('grammar', () => {
  it.each([
    // §5.1 comment lines
    ['name: "a # b"', 'a # b', 'string.quoted.double.toon'],
    ['note: x #tag', 'x #tag', 'string.unquoted.toon'],
    // §6 headers
    ['"a:b"[2]: 1,2', '"a:b"', 'support.type.property-name.toon'],
    ['  - key[2]{a,b}:', 'key', 'support.type.property-name.toon'],
    // §9.5 keyed tabular form
    ['[2:|]{a|b}:', 'b', 'support.type.property-name.field.toon'],
    // §5.2 key-value lines, §7.4 unquoted key tokens
    ['a:b[2]: x', 'a', 'support.type.property-name.toon'],
    ['foo-bar: 1', 'foo-bar', 'support.type.property-name.toon'],
    // §12 the value token is trimmed, so the space after the colon is optional
    ['a:30', '30', 'constant.numeric.toon'],
    ['a:true', 'true', 'constant.language.toon'],
    // §4 number grammar
    ['n[4]: 1e5,-0,.5,05', '1e5', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '-0', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '.5', 'string.unquoted.toon'],
    ['n[4]: 1e5,-0,.5,05', '05', 'string.unquoted.toon'],
    ['n: +1', '+1', 'string.unquoted.toon'],
    // §7.1 escapes
    ['k: "\\u00e9"', '\\u00e9', 'constant.character.escape.toon'],
    ['k: "\\/"', '\\/', 'invalid.illegal.unrecognized-string-escape.toon'],
  ])('%s → %s', (line, text, scope) => {
    expect(scopeOf(line, text)).toBe(scope)
  })
})

describe('spec decode fixtures', () => {
  it.each(fixtureFiles)('%s: comment scope matches §5.1 exactly', async (file) => {
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

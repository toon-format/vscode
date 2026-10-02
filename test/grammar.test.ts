import type { IGrammar } from 'vscode-textmate'
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma'
import { INITIAL, parseRawGrammar, Registry } from 'vscode-textmate'

const require = createRequire(import.meta.url)
const grammarPath = join(import.meta.dirname, '../syntaxes/toon.tmLanguage.json')
const fixtureDir = join(dirname(require.resolve('@toon-format/spec/package.json')), 'tests/fixtures/decode')

let grammar: IGrammar

beforeAll(async () => {
  await loadWASM(readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')).buffer)
  const registry = new Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new OnigScanner(patterns),
      createOnigString: text => new OnigString(text),
    }),
    loadGrammar: async () => parseRawGrammar(readFileSync(grammarPath, 'utf-8'), grammarPath),
  })
  grammar = (await registry.loadGrammar('source.toon'))!
})

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
    ['# note', ' note', 'comment.line.number-sign.toon'],
    ['name: "a # b"', 'a # b', 'string.quoted.double.toon'],
    ['note: x #tag', 'x #tag', 'string.unquoted.toon'],
    // §6 headers
    ['users[2]{id,name}:', 'users', 'support.type.property-name.toon'],
    ['users[2]{id,name}:', 'name', 'support.type.property-name.field.toon'],
    ['items[3|]: a|b|c', '|', 'punctuation.separator.delimiter.toon'],
    ['"a:b"[2]: 1,2', '"a:b"', 'support.type.property-name.toon'],
    ['  - key[2]{a,b}:', 'key', 'support.type.property-name.toon'],
    // §9.3 nested field groups
    ['orders[2]{id,customer{name,country},total}:', 'country', 'support.type.property-name.field.toon'],
    ['orders[2]{id,customer{name,country},total}:', 'total', 'support.type.property-name.field.toon'],
    // §9.5 keyed tabular form
    ['users[2:]{age,city}:', ':', 'keyword.operator.keyed.toon'],
    ['[2:|]{a|b}:', 'b', 'support.type.property-name.field.toon'],
    ['  alice: 30,Berlin', 'alice', 'support.type.property-name.toon'],
    // §5.2 key-value lines, §7.4 unquoted key tokens
    ['a:b[2]: x', 'a', 'support.type.property-name.toon'],
    ['foo-bar: 1', 'foo-bar', 'support.type.property-name.toon'],
    // §4 number grammar
    ['n[4]: 1e5,-0,.5,05', '1e5', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '-0', 'constant.numeric.toon'],
    ['n[4]: 1e5,-0,.5,05', '.5', 'string.unquoted.toon'],
    ['n[4]: 1e5,-0,.5,05', '05', 'string.unquoted.toon'],
    ['n: +1', '+1', 'string.unquoted.toon'],
    // §7.1 escapes
    ['k: "\\u00e9"', '\\u00e9', 'constant.character.escape.toon'],
    ['k: "\\/"', '\\/', 'invalid.illegal.unrecognized-string-escape.toon'],
    // §9.1 empty arrays
    ['tags: []', '[]', 'constant.language.empty-array.toon'],
  ])('%s → %s', (line, text, scope) => {
    expect(scopeOf(line, text)).toBe(scope)
  })
})

describe('spec decode fixtures', () => {
  const files = readdirSync(fixtureDir).filter(file => file.endsWith('.json'))

  it.each(files)('%s: comment scope matches §5.1 exactly', (file) => {
    const { tests } = JSON.parse(readFileSync(join(fixtureDir, file), 'utf-8')) as { tests: { input: string }[] }
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

describe('example document', () => {
  it('tokenizes every line', async () => {
    const source = readFileSync(join(import.meta.dirname, 'fixtures/example.toon'), 'utf-8').trimEnd()
    const lines = source.split('\n')
    const snapshot = tokenize(source).map((tokens, index) => {
      const scoped = tokens
        .filter(([text, scope]) => scope !== 'source.toon' || text.trim() !== '')
        .map(([text, scope]) => `  ${JSON.stringify(text)} ${scope}`)
      return [`> ${lines[index]}`, ...scoped].join('\n')
    })
    await expect(`${snapshot.join('\n')}\n`).toMatchFileSnapshot('__snapshots__/example.toon.txt')
  })
})

import type { UserConfig, UserConfigFn } from 'tsdown/config'
import { defineConfig } from 'tsdown/config'

const config: UserConfig | UserConfigFn = defineConfig({
  entry: 'src/extension.ts',
  external: ['vscode'],
  dts: true,
})

export default config

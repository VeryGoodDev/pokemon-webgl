import esbuild from 'esbuild'
import { performance } from 'node:perf_hooks'

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 * @typedef {import('esbuild').BuildResult} BuildResult
 */

/**
 * @param {string} buildName The name of the build to show in the success or error log
 */
function logRebuild(buildName) {
  return (error) => {
    if (error) {
      console.error(`${buildName} failed to rebuild:`, error)
    } else {
      console.log(`${buildName} successfully rebuilt`)
    }
  }
}

/**
 * @type {BuildOptions}
 */
const baseAppConfig = {
  entryPoints: [`src/main.ts`],
  outdir: `build`,
  bundle: true,
  watch: {
    onRebuild: logRebuild(`App`),
  },
  format: `esm`,
}
/**
 * @type {BuildOptions}
 */
const devAppConfig = {
  ...baseAppConfig,
  sourcemap: true,
}
/**
 * @type {BuildOptions}
 */
const prodAppConfig = {
  ...baseAppConfig,
  minify: true,
}

export default function runBuild(overrides = {}) {
  const buildStart = performance.now()
  const [env] = process.argv.slice(2)
  const baseConfig = env === `prod` ? prodAppConfig : devAppConfig
  const appConfig = {
    ...baseConfig,
    ...overrides,
  }
  const appBuild = esbuild.build(appConfig).then((result) => {
    console.log(`App initially built in ${(performance.now() - buildStart).toFixed(4)} milliseconds`)
    return result
  })
  return appBuild
}

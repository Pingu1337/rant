import { encryptionTests as encryption } from './encryption.js'
import { privateKernelTests as privateKernel } from './private-kernel.js'
import { execSync } from 'child_process'
import { test } from 'tape'
import tapSpec from 'tap-spec'
const argFn = process.argv.slice(3)

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout)

const testFunc = {
  encryption,
  privateKernel
}

const fn = argFn.toString().replace('--', '')
try {
  console.log('\x1b[33m', '\nRunning Tests:', '\x1b[32m', fn, '\x1b[0m')
  testFunc[fn]()
  // execSync(`tape test/${fn}.js | node test/clean-tap-output.js | tap-spec`)

  // execSync(`yarn tape test/${fn}.js | node test/clean-tap-output.js `)
} catch (e) {
  const x = execSync('node -v').toString()
  console.log(x)
  process.argv.push('-s')
  // console.error(`no test file called '${fn}.js' could be found`)
  console.error(e.message)
  process.exit(0)
}

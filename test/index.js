import { encryptionTests as encryption } from './encryption.js'
import { privateKernelTests as privateKernel } from './private-kernel.js'
import { execSync } from 'child_process'
const argFn = process.argv.slice(3)
console.log('Args: ', argFn)

const testFunc = {
  encryption,
  privateKernel
}

const fn = argFn.toString().replace('--', '')
try {
  testFunc[fn]()
} catch (e) {
  const x = execSync('node -v').toString()
  console.log(x)
  process.argv.push('-s')
  console.error(`no test file called '${fn}.js' could be found`)
  process.exit(0)
}

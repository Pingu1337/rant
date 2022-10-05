import test from 'tape-catch'
import { MemoryLevel } from 'memory-level'
import Kernel from '../blockend/kernel.js'
import { get } from 'piconuro'
import { decrypt } from '../frontend/encryption.js'

export async function encryptionTests () {
  test('Encryption/Decryption tests', async t => {
    const message = 'sample message' // The message to encrypt

    /* use this to test only the encryption */
    // const $secret = '1337'
    // await testEncrypt(message, $secret, false, t)

    /* use this to test encryption + decryption */
    const $secret = '666666'
    await testEncrypt(message, $secret, true, true, t)

    /** loop tests with different pin codes */
    // const usedPINs = []
    // for (let i = 0; i < 500; i++) {
    //   const $secret = mockPin(1000, 99999).toString() // Generate a random 4-digit PIN number
    //   await testEncrypt(message, $secret, true, t)
    //   usedPINs.push($secret)
    // }
    // usedPINs.push($secret)
    // console.info('LOOP DONE')
    // console.info('used PIN numbers: ', usedPINs)
    // console.info('combinations tried: ', usedPINs.length)
    t.end()
  })
}

async function testEncrypt (message, secret, decryption, testWrongPin, t) {
  // console.log('\x1b[33m', `Encrypting '${message}' using the secret '${secret}'`)
  log('encrypting {} using the secret {}', [message, secret])
  // console.log('Secret: ', secret)
  const k = new Kernel(makeDB())
  await k.boot()

  t.notOk(get(k.$rant()).id) // current -> undefined
  // Create new Rant
  await k.checkout(null) // makes new.
  let rant = get(k.$rant())
  t.equal(rant.id, 'draft:0')
  t.equal(rant.state, 'draft')
  await k.setText(message)
  await k.setTheme(1)
  // set encryption level 1 (KeyPad)
  await k.setEncryption(1)
  // set secret
  await k.setSecret(secret)
  await k.encryptMessage(secret)
  rant = get(k.$rant())
  t.notEqual(rant.text, message)
  log('encrypted: {}', [rant.text])
  t.equal(rant.theme, 1)
  t.equal(rant.encryption, 1)
  await k.commit()
  rant = get(k.$rant())
  t.equal(rant.state, 'signed')
  t.ok(rant.author)
  t.equal(get(k.$rants()).length, 1)
  const url = await k.pickle()
  t.ok(url)
  if (decryption) {
    const k2 = new Kernel(makeDB())
    await k2.boot()
    // When loading from hash
    await k2.import(`https://xor.cry/${url}`) // dispatch(Feed.from(hash))
    const rant = get(k2.$rant()) // imported
    t.ok(rant.decrypted, 'Not encrypted')
    t.equal(rant.state, 'signed')

    /* simulate the decrypt function in 'keypad-dialog.js */
    const decrypted = await decryptMessage(rant.text, secret)
    t.equal(decrypted, message)
    log('decrypted: {}', [decrypted])
  }
  if (testWrongPin) {
    const incorrectSecret = mockPin(1000, 9999).toString()
    const k3 = new Kernel(makeDB())
    await k3.boot()
    // When loading from hash
    await k3.import(`https://xor.cry/${url}`) // dispatch(Feed.from(hash))
    const rant = get(k3.$rant()) // imported
    t.ok(rant.decrypted, 'Not encrypted')
    t.equal(rant.state, 'signed')

    /* simulate the decrypt function in 'keypad-dialog.js */
    const decrypted = ''
    try {
      await decryptMessage(rant.text, incorrectSecret)
    } catch (e) {
      logError(e.message, [])
    }

    t.notEqual(decrypted, message)
  }
}

async function decryptMessage (message, secret) {
  const decrypted = await decrypt(message, secret)
  return decrypted
}

/* Function used to generate random 4-digit PIN numbers */
function mockPin (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function makeDB () {
  return new MemoryLevel('rant.lvl', { keyEncoding: 'buffer', valueEncoding: 'buffer' })
}
const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m' // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
}
function logError (message, vars) {
  for (const v of vars) {
    message = message.replace('{}', colours.fg.yellow + `'${v}'` + colours.fg.red)
  }
  message = ' '.repeat(3) + '🚨 ' + message
  process.stdout.write(colours.fg.red)
  process.stdout.clearLine(0)
  console.error(message, colours.reset)
}

function log (message, vars) {
  for (const v of vars) {
    message = message.replace('{}', colours.fg.blue + `'${v}'` + colours.fg.yellow)
  }
  message = ' '.repeat(3) + '💡 ' + message
  process.stdout.write(colours.fg.yellow)
  process.stdout.clearLine(0)
  console.log(message, colours.reset)
}

// function throwError () {
//   throw new Error('Error: Meltdown in reactor 4')
// }

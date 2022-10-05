import test from 'tape'
import { MemoryLevel } from 'memory-level'
import Kernel from '../blockend/kernel.js'
import { get } from 'piconuro'
import { decrypt } from '../frontend/encryption.js'

export async function encryptionTests () {
  /* use this to test only the encryption */
  // await testEncrypt(message, $secret, false)

  /* use this to test encryption + decryption */
  // await testEncrypt(message, $secret, true)

  test('Decryption Loop', async t => {
    const message = 'sample message' // The message to encrypt
    const usedPINs = []
    for (let i = 0; i < 100; i++) {
      const $secret = mockPin(1000, 99999).toString() // Generate a random 4-digit PIN number
      await testEncrypt(message, $secret, true, t)
      usedPINs.push($secret)
    }
    t.equal(message, 'sample message')
    console.info('LOOP DONE')
    console.info('used PIN numbers: ', usedPINs)
    console.info('combinations tried: ', usedPINs.length)
  })
}

async function testEncrypt (message, secret, decryption, t) {
  console.log('Secret: ', secret)
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

    /* simulate the decrypt function in 'keypad-dialog.js */
    const decrypted = await decryptMessage(rant.text, secret)
    t.equal(rant.state, 'signed')
    t.equal(decrypted, message)
    console.log('decrypted: ', decrypted)
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

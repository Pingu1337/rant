import Tonic from '@socketsupply/tonic/index.esm.js'
import './keypad-dialog.css'

Tonic.add(class KeypadDialog extends Tonic {
  click (e) {
    const KeyPad = document.getElementById('KeyPadDisplay')
    const KeyPadVal = document.getElementById('KeyPadDisplay').value
    // if number button is pressed
    if (e.target.accessKey === 'keyBtn') {
      KeyPad.value = KeyPadVal + e.target.value
      // if lock button is pressed
    } else if (e.target.accessKey === 'lockBtn') {
      console.log(KeyPadVal)
      // if backspace button is pressed
    } else if (e.target.accessKey === 'BackspaceBtn') {
      const NewVal = RemoveLastChar(KeyPadVal)
      KeyPad.value = NewVal
    }
  }

  render () {
    return this.html`
    <div class='keypad'>
    <div class='row'>
    <input id='KeyPadDisplay' type='password' disabled/>
    <button accessKey="BackspaceBtn" class='BackspaceBtn'>⌫</button>
    </div>
      <div class='row'>
        <button value='1' accessKey='keyBtn'>1</button>
        <button value='2' accessKey='keyBtn'>2</button>
        <button value='3' accessKey='keyBtn'>3</button>
      </div>
      <div class='row'>
        <button value='4' accessKey='keyBtn'>4</button>
        <button value='5' accessKey='keyBtn'>5</button>
        <button value='6' accessKey='keyBtn'>6</button>
      </div>
      <div class='row'>
        <button value='7' accessKey='keyBtn'>7</button>
        <button value='8' accessKey='keyBtn'>8</button>
        <button value='9' accessKey='keyBtn'>9</button>
      </div>
      <div class='row'>
        <button accessKey='lockBtn'>Lock</button>
      </div>
    </div>
  `
  }
})

// Function to remove the last char in string
function RemoveLastChar (value) {
  value = value.slice(0, -1)
  return value
}

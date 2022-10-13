import Tonic from '@socketsupply/tonic/index.esm.js'
import { navigate } from '../router.js'

Tonic.add(class EmojiPicker extends Tonic {
  click (e) {
    const el = Tonic.match(e.target, 'button[data-route]')
    if (!el) return
    const path = el.dataset.route
    navigate(path)
  }

  render () {
    // 📝
    return this.html/* html */`
      <nav class="row">
        <div>
            <span>emojis</span>
        </div>
      </nav>
    `
  }
})

export function mountEmojiPicker () {
  console.log('Mounting emoji picker')
  const picker = document.createElement('emoji-picker')
  document.querySelector('editor').appendChild(picker)
}
export function unMountEmojiPicker () {
  console.log('Unmounting emoji picker')
  try {
    document.querySelector('emoji-picker').remove()
  } catch (e) {
    console.error(e.message)
  }
}

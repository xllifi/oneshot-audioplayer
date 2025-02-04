<script lang="ts" module>
  import { randNum } from '../routes/helpers'

  export let gramophone: HTMLElement
  // Gramophone animation
  let gramophone_sprite_no = $state(1)
  let gramophone_reverse = $state(false)
  setInterval(() => {
    if (niko_state == 'sleep') return
    if (gramophone_reverse) {
      gramophone_sprite_no -= 1
      if (gramophone_sprite_no <= 1) gramophone_reverse = false
      return
    }
    gramophone_sprite_no += 1
    if (gramophone_sprite_no >= 5) gramophone_reverse = true
  }, 100)

  // Niko animation
  type NikoStates = 'sleep' | 'jam' | 'stand1' | 'stand2'
  let niko_state: NikoStates = $state('sleep')
  let niko_sprite_no = $state(0)
  let niko_sprite_no_max = 0
  let niko_ms = 0
  adjustForNikoState()
  setTimeout(nikoTimeout, niko_ms)

  function nikoTimeout() {
    if (niko_sprite_no >= niko_sprite_no_max) niko_sprite_no = 1
    else niko_sprite_no += 1

    if (niko_state == 'stand1') {
      if (niko_sprite_no % 2 == 0) {
        console.log(`changing timing to 1000`)
        niko_ms = 1000
      } else {
        console.log(`changing timing to 300`)
        niko_ms = 300
      }
    }

    setTimeout(nikoTimeout, niko_ms)
  }

  export function setNikoSleep(sleep: boolean) {
    if (sleep) {
      niko_state = 'sleep'
    } else {
      const stateNo = randNum(0, 2)
      switch (stateNo) {
        case 0:
          niko_state = 'jam'
          break
        case 1:
          niko_state = 'stand1'
          break
        case 2:
          niko_state = 'stand2'
          break
        default:
          alert('something went wrong')
          break
      }
    }
    adjustForNikoState()
  }
  function adjustForNikoState() {
    switch (niko_state) {
      case 'sleep': {
        niko_sprite_no_max = 2
        niko_ms = 1000
        break
      }
      case 'jam': {
        niko_sprite_no_max = 4
        niko_ms = 300
        break
      }
      case 'stand1': {
        niko_sprite_no_max = 4
        niko_ms = 1000
        break
      }
      case 'stand2': {
        niko_sprite_no_max = 4
        niko_ms = 200
        break
      }
    }
    niko_sprite_no = 0
  }
</script>

<div class="images">
  <div class="sun"></div>
  <div bind:this={gramophone} class="gramophone" style="background-position: {gramophone_sprite_no}00px 0;"></div>
  <div
    class="niko"
    style="
    background-position: {niko_sprite_no}00px 0;
    background-image: url('/sprites/niko_{niko_state}.png');
  "
  ></div>
</div>

<style lang="scss">
  div.images {
    display: flex;
    grid-row: 2;
    align-items: end;
    justify-content: center;

    height: calc(100% - 16px);

    div {
      aspect-ratio: 1/1;
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }

    div.sun {
      height: 36px;
      background-image: url('/sprites/small_sun.png');
      background-size: auto 36px;
    }

    div.gramophone {
      height: 100px;
      background-image: url('/sprites/gramophone.png');
      background-size: auto 100px;
    }

    div.niko {
      height: 100px;
      margin-left: -20px;

      background-size: auto 100px;
    }
  }
</style>

<script lang="ts">
  import { setNikoSleep } from './Images.svelte'

  type Props = {
    audio: HTMLAudioElement
    isLocked: boolean
    setAudioFile: (file: File) => void
  }
  const { audio, isLocked, setAudioFile }: Props = $props()

  let progress = $state(audio.currentTime)
  let duration = $state(audio.duration)
  let volume = $state(audio.volume * 100)

  function updateMeta() {
    progress = audio.currentTime
    duration = audio.duration
    volume = audio.volume * 100
  }
  function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600) // hours
    const m = Math.floor(Math.floor(seconds % 3600) / 60) // minutes
    const s = Math.floor(Math.floor(seconds % 3600) % 60) // seconds

    return h > 0 ? `${h.toString().padStart(2, '0')}:` : '' + `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  audio.addEventListener('loadedmetadata', () => {
    console.log(audio.duration)
    duration = audio.duration
    audio.volume = 0.2
  })

  setInterval(updateMeta, 300)

  /*
   * User Input
   */
  function handleArrows(e: KeyboardEvent) {
    if (isLocked) return
    switch (e.key) {
      case 'ArrowLeft':
        return (audio.currentTime -= 2)
      case 'ArrowRight':
        return (audio.currentTime += 2)
      default:
        console.log(e.key)
    }
  }
  function handleTimeSlider(e: Event) {
    if (isLocked) return
    if (!(e.target instanceof HTMLInputElement)) return
    audio.currentTime = parseInt(e.target.value)
    updateMeta()
  }
  function handlePlay() {
    if (isLocked) return
    if (audio.paused) {
      audio.play()
      setNikoSleep(false)
    } else {
      audio.pause()
      setNikoSleep(true)
    }
  }
  function handleVolSlider(e: Event) {
    if (isLocked) return
    if (!(e.target instanceof HTMLInputElement)) return
    audio.volume = parseInt(e.target.value) / 100
    updateMeta()
  }
  function handleMute() {
    if (isLocked) return
    if (audio.muted) audio.muted = false
    else audio.muted = true
    updateMeta()
  }
  function handleLoop() {
    if (isLocked) return
    if (audio.loop) audio.loop = false
    else audio.loop = true
    updateMeta()
  }

  function filePickerHandler(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return
    if (!e.target.files) return
    setAudioFile(e.target.files[0])
  }

  let controlswrapper: HTMLDivElement | null = $state(null)
  function handleScroll(e: WheelEvent) {
    if (!controlswrapper) return
    e.preventDefault()

    let newTop: number
    if (e.deltaY < 0) {
      newTop = Math.floor(controlswrapper.scrollTop / controlswrapper.getBoundingClientRect().height - 1) * controlswrapper.getBoundingClientRect().height
    } else {
      newTop = Math.floor(controlswrapper.scrollTop / controlswrapper.getBoundingClientRect().height + 1) * controlswrapper.getBoundingClientRect().height
    }
    controlswrapper.scrollTo({ top: newTop, behavior: 'smooth' })
  }
</script>

<svelte:window onkeydown={handleArrows} onwheel={handleScroll} />

<div class="controlswrapper" bind:this={controlswrapper}>
  <div class="controls">
    <div class="slider">
      <p>{formatTime(progress)}</p>
      <input type="range" min={0} max={duration} value={progress} oninput={handleTimeSlider} />
      <p>{formatTime(duration)}</p>
    </div>
    <div class="buttons">
      <label for="upload">
        <button class="ctrl upload" aria-label="Select a file"></button>
        <input type="file" id="upload" accept=".mp3,.ogg,.wav" onchange={filePickerHandler} />
      </label>
      <button onclick={handlePlay} class="ctrl" class:play={audio.paused} class:pause={!audio.paused} aria-label="Toggle play"></button>
      <button onclick={handleLoop} class="ctrl" class:doloop={audio.loop} class:noloop={!audio.loop} aria-label="Toggle play"></button>
      <div class="slider">
        <button onclick={handleMute} class="ctrl" class:mute={audio.muted} class:unmute={!audio.muted} aria-label="Toggle mute"></button>
        <input type="range" min={0} max={100} value={volume} oninput={handleVolSlider} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../static/css/main.scss';

  div.controlswrapper {
    overflow-y: scroll;
    outline: solid 2px var(--accent-color);

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #0000;
    }
    &::-webkit-scrollbar-thumb {
      width: 4px;
      border: 2px solid #0000;
      background-clip: content-box;
      background-color: var(--accent-color);
    }

    div.controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 4px;

      div.slider {
        display: flex;
        align-items: center;
        height: fit-content;

        height: 24px;
        margin: 0;
        padding: 0;
        input[type='range'] {
          appearance: none;
          height: 2px;

          margin: 0 4px;
          background-color: var(--accent-color);
          cursor: pointer;

          &::-webkit-slider-thumb {
            appearance: none;
            width: 4px;
            height: 16px;
            background-color: var(--accent-color);
          }
        }
      }
      div.buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        * {
          height: 24px;
        }

        button.ctrl {
          position: relative;
          aspect-ratio: 1/1;
          height: 24px;

          &::after {
            position: absolute;
            top: 0;
            left: 0;
            aspect-ratio: 1/1;
            height: 24px;
            background-image: url('/sprites/controls.png');
            background-size: auto 24px;
            content: '';
          }
          &.play::after {
            background-position: -1px -1px;
          }
          &.pause::after {
            background-position: -24px -1px;
          }
          &.unmute::after {
            background-position: -48px -1px;
          }
          &.mute::after {
            background-position: -72px -1px;
          }
          &.upload::after {
            background-position: -96px -1px;
          }
          &.doloop::after {
            background-position: -120px -1px;
          }
          &.noloop::after {
            background-position: -144px -1px;
          }
          &:hover::after {
            filter: brightness(0);
          }
        }

        label[for='upload'] {
          cursor: pointer;

          button {
            pointer-events: none;
          }
          &:hover > button {
            background-color: var(--accent-color);
            color: #000;
            &::after {
              filter: brightness(0);
            }
          }
          input[type='file'] {
            display: none;
          }
        }
        div.slider {
          input[type='range'] {
            width: 48px;
          }
        }
      }
    }
  }
</style>

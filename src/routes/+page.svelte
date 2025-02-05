<script lang="ts">
  import { fade } from 'svelte/transition'
  import Controls from '../components/Controls.svelte'
  import Images, { setNikoSleep } from '../components/Images.svelte'
  import Notes from '../components/Notes.svelte'

  // Audio player
  let isLocked = $state(true)
  export const audio = new Audio()
  async function setAudioFile(file: File) {
    audio.src = URL.createObjectURL(file)
    isLocked = false
    audio.play()
    setNikoSleep(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    console.log(e)
    hideDrag()

    if (!e.dataTransfer) return

    let file: File | null
    if (e.dataTransfer.items) {
      file = [...e.dataTransfer.items].filter((x) => x.kind == 'file')[0].getAsFile()
    } else {
      file = [...e.dataTransfer.items][0]
    }

    if (!file) return
    setAudioFile(file)
  }

  let isDragOver: boolean = $state(false)
  function showDrag(e: DragEvent) {
    e.preventDefault()
    console.log(e)
    isDragOver = true
  }
  function hideDrag() {
    isDragOver = false
  }
</script>

<svelte:body
  ondragenter={showDrag}
  ondrop={handleDrop}
  ondragover={(e) => {
    e.preventDefault()
  }}
/>

{#if isDragOver}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="dragover" transition:fade={{ duration: 100 }} ondragleave={hideDrag}>
    <p>Drop files here</p>
  </div>
{/if}
<div class="grid">
  <Images />
  <Controls {audio} {isLocked} {setAudioFile} />
</div>
<Notes {audio} />

<style lang="scss">
  div.grid {
    display: grid;
    grid-template-rows: auto 92px;
  }
  div.dragover {
    display: flex;
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    outline: dashed 2px var(--accent-color);
    outline-offset: -12px;

    background-color: #000d;

    p {
      color: #fff;
      font-size: 20px;
      pointer-events: none;
    }
    &::after {
      position: absolute;
      width: 100%;
      height: 100%;

      outline: solid 2px color-mix(in srgb, var(--accent-color) 70%, #000);
      outline-offset: -2px;
      content: '';
    }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte'
  import { randNum } from '../routes/helpers'
  import { gramophone } from './Images.svelte'

  type Note = {
    id: number
    age: number
    x: number
    y: number
    xvel: number
    yvel: number
    type: number
    color: `#${string}`
  }
  type Props = {
    audio: HTMLAudioElement
  }
  const { audio }: Props = $props()

  // Notes
  let gramophone_left: number = $state(0)
  let gramophone_top: number = $state(0)
  let notes: Note[] = $state([])
  onMount(setNotesSize)
  function setNotesSize() {
    gramophone_left = gramophone.getBoundingClientRect().left
    gramophone_top = gramophone.getBoundingClientRect().top
  }

  // Generate notes
  const maxvel = 12
  setInterval(() => {
    if (audio.paused) return
    if (notes.length >= 6) return
    const xvel = randNum(1, maxvel)
    pushNote({
      id: 0,
      age: 0,
      x: randNum(0, 10),
      y: randNum(0, 10),
      xvel: xvel / randNum(3, 5),
      yvel: (maxvel - xvel) / randNum(3, 5),
      type: Math.floor(randNum(0, 2)),
      color: `#${randNum(25, 192).toString(16)}${randNum(25, 192).toString(16)}${randNum(25, 192).toString(16)}`
    })
  }, 350)

  // Animate notes
  setInterval(() => {
    const newNotes = notes.map((note) => {
      note.x += note.xvel
      note.y += note.yvel
      if (note.age > 15) {
        const tmp = note.xvel
        note.xvel = note.yvel
        note.yvel = tmp
        note.age = 0
      } else {
        note.age++
      }
      return note
    })
    notes = newNotes.filter((note) => !(note.x + note.y > 160))
  }, 12)

  // Helper for adding notes
  function pushNote(note: Note): void {
    let id = 0
    if (notes.length > 0 && notes[0].id != undefined) {
      // id might store some insane number so dont do it
      if (notes[0].id > 127 && notes.filter((x) => x.id == 0).length == 0) {
        id = 0
      } else {
        id = notes[0].id + 1
      }
    }
    note = { ...note, id }
    notes = [note, ...notes]
  }
</script>

<svelte:window onresize={setNotesSize} />

<div class="notes" style="width: {gramophone_left + 54 + 50}px;height: {gramophone_top + 58 + 50}px;">
  {#each notes as note, key (note.id)}
    <span
      class="note"
      style="transform: translate(-{note.x + 50}px, -{note.y + 50}px);
      mask-position: {note.type * 16}px;
      background-color: {note.color};
      opacity: {(160 - (note.x + note.y)) / 12.5}"
    ></span>
  {/each}
</div>

<style lang="scss">
  div.notes {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    color: #fff;

    filter: drop-shadow(1px 1px 0 #000);
    pointer-events: none;

    .note {
      position: absolute;
      right: 0;
      bottom: 0;
      aspect-ratio: 1/1;
      height: 16px;

      background-color: #55f;

      filter: drop-shadow(2px 2px 0 #000);
      mask-image: url('/sprites/notes.png');

      transition: transform 200ms ease-out;
    }
  }
</style>

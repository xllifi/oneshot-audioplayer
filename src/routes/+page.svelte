<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";

  const window = getCurrentWindow();

  // Gramophone animation
  let gramophone_sprite_no = $state(1);
  let gramophone_reverse = $state(false);
  setInterval(() => {
    if (gramophone_reverse) {
      gramophone_sprite_no -= 1;
      if (gramophone_sprite_no <= 1) {
        gramophone_reverse = false;
      }
      return;
    }
    gramophone_sprite_no += 1;
    if (gramophone_sprite_no >= 5) {
      gramophone_reverse = true;
    }
  }, 100);

  // Niko animation
  let niko_sprite_no = $state(1);
  setInterval(() => {
    if (niko_sprite_no >= 4) {
      niko_sprite_no = 1;
      return;
    }
    niko_sprite_no += 1;
  }, 300);

  // Notes
  let gramophone: HTMLElement = $state() as HTMLElement;
  let gramophone_left: number = $state(0);
  let gramophone_top: number = $state(0);
  let notes: Note[] = [
    {
      right: 0,
      bottom: 0,
      type: 1,
      color: "#55f"
    }
  ]
  onMount(() => {
    gramophone_left = gramophone.getBoundingClientRect().left;
    gramophone_top = gramophone.getBoundingClientRect().top;
  });

  type Note = {
    right: number
    bottom: number
    type: 0 | 1 | 2
    color: `#${string}`
  }
  
</script>

<main class="container">
  <div data-tauri-drag-region class="titlebar">
    <span class="note"></span>
    <p class="text">OneShot WME music player</p>
    <div class="buttons">
      <button
        onclick={window.minimize}
        style="background-position: -1px -1px;"
        aria-label="Minimize window"
      ></button>
      <button
        onclick={window.close}
        style="background-position: 27px -1px;"
        aria-label="Close window"
      ></button>
    </div>
  </div>
  <div class="images">
    <div class="sun"></div>
    <div
      bind:this={gramophone}
      class="gramophone"
      style="background-position: {gramophone_sprite_no}00px 0;"
    ></div>
    <div
      class="niko"
      style="background-position: {niko_sprite_no}00px 0;"
    ></div>
  </div>
  <div class="controls">
    {gramophone_left}
    {gramophone_top}
  </div>
</main>
<secondary class="particles" style="width: {gramophone_left + 64}px; height: {gramophone_top + 64}px;">
  {#each notes as note}
    <span
      class="note"
      style="right: {note.right};
      bottom: {note.bottom};"
    ></span>
  {/each}
</secondary>

<style>
  @font-face {
    src: url("fonts/Minecraft-Seven_v2-Regular.otf");
    font-family: "Minecraft Seven";
  }

  * {
    margin: 0;
    padding: 0;
  }

  :root {
    --accent-color: #9660f3;

    padding: 0;
    margin: 0;
    font-family: "Minecraft Seven";
    font-size: 16px;
    text-rendering: geometricPrecision;
    line-height: 24px;
    font-weight: 400;
    image-rendering: pixelated;

    background-color: #000;
    color: #fff;
  }

  .particles {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;

    width: 100dvw;
    height: 100dvh;

    background-color: red;

    .note {
      position: absolute;
      height: 16px;
      aspect-ratio: 1/1;

      background-color: #55f;
      mask-image: url(sprites/notes.png);
      mask-size: auto 16px;
      mask-position: 16px;

      filter: drop-shadow(2px 2px 0 #000);

      top: 50px;
    }
  }

  .container {
    width: 100dvw;
    height: 100dvh;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 38px auto auto;

    outline: solid 2px var(--accent-color);
    outline-offset: -2px;

    div.titlebar {
      grid-row: 1;
      outline: solid 2px var(--accent-color);
      outline-offset: -2px;

      display: flex;
      align-items: center;

      position: relative;

      * {
        pointer-events: none;
      }

      p.text {
        margin-left: 0.4rem;
      }

      span.note {
        height: 16px;
        aspect-ratio: 1/1;

        background-image: url(sprites/notes.png);
        background-size: auto 16px;
        background-position: 16px;
        margin-left: 0.6rem;
      }

      div.buttons {
        right: 0;
        height: 100%;
        width: fit-content;

        position: absolute;

        display: flex;
        align-items: center;
        gap: 0.2rem;
        margin-right: 0.3rem;

        button {
          pointer-events: all;
          cursor: pointer;

          height: 28px;
          aspect-ratio: 1/1;

          background-color: var(--accent-color);
          background-image: url(sprites/window_buttons.png);
          background-size: 200%;
          image-rendering: pixelated;
          border: none;
          color: var(--accent-color);

          transition: filter 100ms;

          &:hover {
            filter: brightness(70%);
          }
        }
      }
    }

    div.images {
      grid-row: 2;

      display: flex;
      justify-content: center;
      align-items: end;

      height: fit-content;

      div.sun {
        height: 36px;
        aspect-ratio: 1/1;

        background-image: url(sprites/small_sun.png);
        background-size: auto 36px;
      }

      div.gramophone {
        height: 100px;
        aspect-ratio: 1/1;

        background-image: url(sprites/gramophone.png);
        background-size: auto 100px;
      }

      div.niko {
        height: 100px;
        aspect-ratio: 1/1;

        background-image: url(sprites/niko_jam.png);
        background-size: auto 100px;

        margin-left: -20px;
      }
    }

    div.controls {
      outline: solid 2px var(--accent-color);
    }
  }
</style>

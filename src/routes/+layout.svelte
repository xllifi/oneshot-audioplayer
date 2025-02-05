<script lang="ts">
  import { getCurrentWindow } from '@tauri-apps/api/window'
  const window = getCurrentWindow()
  let { children } = $props()
</script>

<main>
  <div data-tauri-drag-region class="titlebar">
    <span class="note"></span>
    <p class="text">OneShot WME audio player</p>
    <div class="buttons">
      <button onclick={window.minimize} style="background-position: -1px -1px;" aria-label="Minimize window"></button>
      <button onclick={window.close} style="background-position: 27px -1px;" aria-label="Close window"></button>
    </div>
  </div>
  {@render children()}
</main>

<style lang="scss">
  @use '../../static/css/main.scss';

  main {
    display: grid;
    grid-template-rows: 36px auto;
    width: calc(100dvw - 4px);
    height: calc(100dvh - 4px);
    padding: 2px;
    outline: solid 2px var(--accent-color);
    outline-offset: -2px;

    background-color: #000;
    color: #fff;

    div.titlebar {
      display: flex;

      position: relative;
      grid-row: 1;
      align-items: center;
      outline: solid 2px var(--accent-color);

      * {
        pointer-events: none;
      }

      p.text {
        margin-left: 0.4rem;
      }

      span.note {
        aspect-ratio: 1/1;
        height: 16px;
        margin-left: 0.6rem;

        background-image: url('/sprites/notes.png');
        background-position: 16px;
        background-size: auto 16px;
      }

      div.buttons {
        display: flex;

        position: absolute;
        right: 0;
        align-items: center;
        width: fit-content;
        height: 100%;
        margin-right: 4px;
        gap: 4px;

        button {
          aspect-ratio: 1/1;

          height: 28px;
          border: none;
          outline: none;
          background-image: url('/sprites/window_buttons.png');
          background-size: 200%;

          background-color: var(--accent-color);
          color: var(--accent-color);
          cursor: pointer;
          image-rendering: pixelated;
          pointer-events: all;
          transition: filter 100ms;

          &:hover {
            filter: brightness(70%);
          }
        }
      }
    }
  }
</style>

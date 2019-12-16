<script>
  export let el;
  export let index;
</script>

<style>
.CHAT_EL_CONTIANER {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<clipPath id={el.id + index}>
  {#if el.tagName === 'circle'}
    <circle 
      cx={el.position.r} 
      cy={el.position.r} 
      r={el.position.r}
    />
  {:else if el.tagName === 'ellipse'}
    <ellipse 
      cx={el.position.rx} 
      cy={el.position.ry} 
      rx={el.position.rx}
      ry={el.position.ry}
    />
  {:else if el.tagName === 'rect'}
    <rect 
      width={el.position.width}
      height={el.position.height}
      x={0}
      y={0}
    />
  {/if}
</clipPath>

<foreignObject x={el.position.x} y={el.position.y} width={el.position.width} height={el.position.height} clip-path="url(#{el.id + index})">
  <div xmlns="http://www.w3.org/1999/xhtml" class="CHAT_EL_CONTAINER">
    {@html el.content[index].outerHTML}
  </div>
</foreignObject>
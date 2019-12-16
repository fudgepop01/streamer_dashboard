import { ETStore } from './stores';

const buildTSpans = (text, calculated) => {
  let {
    firstLineYPos,
    xPos,
    multiLine,
    lineHeight
  } = calculated;
  let out = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  
  for (const [i, line] of text.split('\n').entries()) {
    let tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');

    tspan.setAttributeNS(null, 'x', xPos);
    if (multiLine) tspan.setAttributeNS(null, 'y', firstLineYPos + lineHeight * i);
    else tspan.setAttributeNS(null, 'y', firstLineYPos);

    tspan.textContent = line;
    Splitting({
      target: tspan,
      by: 'chars'
    });
    tspan.innerHTML = tspan.innerHTML.replace(/<span/g, '<tspan').replace(/<\/span>/g, '</tspan>');
    out.appendChild(tspan);
  } 

  return out;
}

/** @this {SVGElement} */
const replaceText = async function (text, {animate, alignment, oldOut, newStart, newEnd}) {
  let spans = this.children[0];
  let outputText = buildTSpans(text, this.calculated);

  let res = Splitting({
    target: spans,
    by: 'chars'
  });

  spans.innerHTML = spans.innerHTML.replace(/<span/g, '<tspan').replace(/<\/span>/g, '</tspan>');
  
  if (animate) {
    await anime({
      targets: spans.querySelectorAll('tspan.char'),
      ...oldOut,
      delay: (oldOut.delay) ? anime.stagger(oldOut.delay.ms, oldOut.delay.args) : ''
    }).finished;

    spans.innerHTML = outputText.innerHTML;
    if (alignment !== 'left') {
      for (const ch of spans.children) {
        if (alignment == 'right') ch.setAttributeNS(null, 'x', this.calculated.bbox.x + this.calculated.bbox.width - ch.getComputedTextLength()) 
        else ch.setAttributeNS(null, 'x', this.calculated.bbox.x + this.calculated.bbox.width/2 - ch.getComputedTextLength()/2) 
      }
    }

    anime.set(spans.querySelectorAll('tspan.char'), newStart);

    anime({
      targets: this.querySelectorAll('tspan.char'),
      ...newEnd,
      delay: (newEnd.delay) ? anime.stagger(newEnd.delay.ms, newEnd.delay.args) : ''
    })
  } else {
    spans.innerHTML = outputText.innerHTML;

    if (alignment !== 'left') {
      for (const ch of spans.children) {
        if (alignment == 'right') ch.setAttributeNS(null, 'x', this.calculated.bbox.x + this.calculated.bbox.width - ch.getComputedTextLength()) 
        else ch.setAttributeNS(null, 'x', this.calculated.bbox.x + this.calculated.bbox.width/2 - ch.getComputedTextLength()/2) 
      }
    }

    anime.set(spans.querySelectorAll('tspan.char'), newEnd)
  }  

  ETStore[this.id] = {
    text,
    calculated: this.calculated,
    alignment,
  };
}

export const ETProcessor = {
  role: 'EditableText',

  /**
   *
   *
   * @param {*} calculated
   * @param {SVGElement} el
   */
  process: (calculated, el, id) => {
    if (ETStore[id]) {
      let {text, calculated, alignment} = ETStore[id];
      el.calculated = calculated;
      el.replaceText = replaceText;

      el.replaceText(text, {animate: false, alignment})
    } else {
      let ch = el.children[0];
    
      calculated.firstLineYPos = parseFloat(ch.children[0].getAttributeNS(null, 'y'));
      calculated.xPos = parseFloat(ch.children[0].getAttributeNS(null, 'x'));
      
      if (ch.children.length > 1) {
        calculated.multiLine = true;
        calculated.lineHeight = parseFloat(ch.children[1].getAttributeNS(null, 'y')) - parseFloat(ch.children[0].getAttributeNS(null, 'y'));
      }

      calculated.fontFamily = ch.getAttributeNS(null, 'font-family');
      calculated.color = ch.getAttributeNS(null, 'fill');
      calculated.fontSize = ch.getAttributeNS(null, 'font-size');


      // el.calculated is used for immediate 
      // accessibility within the element
      el.calculated = calculated;
      el.replaceText = replaceText;
    }

    
  }
}
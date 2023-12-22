import { createCanvas } from "canvas"

export default (width, height) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const obj = {
    canvas,
    ctx,

    rect: (x, y, w, h, r) => {
      if(r > 0) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y,   x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x,   y+h, r);
        ctx.arcTo(x,   y+h, x,   y,   r);
        ctx.arcTo(x,   y,   x+w, y,   r);
        ctx.closePath();
      }
      else ctx.rect(x, y, w, h);
      return obj;
    },
    fill: color => {
      ctx.fillStyle = color;
      return obj;
    },
    path: str => {
      let instructions = str.match(/(\w)\s*(\d+\s*)+/g);

      
      ctx.beginPath();
      for (let i = 0; i < instructions.length; i++) {
        
      }
      ctx.closePath();
    }
  };

  return obj;
}


export const parsenums = str => {

}

/**
 * @type {{ [key: string]: ((import('canvas').CanvasRenderingContext2D, number[], Record<string, number>) => void) }}
 */
const instructions = {
  M: (ctx, params, current) => ctx.moveTo(current.x = params[0], current.y = params[1]),
  L: "lineTo",
  C: "bezierCurveTo",
  Z: "closePath"
}
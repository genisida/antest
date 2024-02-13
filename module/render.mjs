export const sketch = func => p5 => {
  p5.setup = function() {
    p5.createCanvas(1024, 1024);
    p5.colorMode(p5.HSB, 1);
  }
  p5.draw = function() {
    const [data, volume] = func();
    p5.clear();
    p5.translate(512, 512);
    p5.noStroke();
    for (let i = 1; i < 1024; i++) {
      p5.push();
      const li = Math.log2(i);
      p5.rotate(li % 1 * -p5.TWO_PI);
      p5.fill(li % 1, data[i], li / 10, 1 / 4);
      p5.ellipse(0, li * 48, data[i] * 128 * volume);
      p5.pop();
    }
  }
}

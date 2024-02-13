/**
 * 素材配布用モジュール。
 * @module audioVisualizer
 * @param {Object} prop - 引数まとめたやつ。
 * @param {string} prop.type - タイプ。"buffer"か"oscillator"。
 * @param {number} prop.hz - ヘルツ。
 * @param {string} prop.src - 音源のURL。
 * @return {object} - AudioVisualizer。
 */
export const AudioVisualizer = class {
  constructor(prop) {
    this.context = new AudioContext();
    this.analyser = new AnalyserNode(this.context, { smoothingTimeConstant: 0.25, sampleRate: this.context.sampleRate });
    this.prop = prop;
    this.size = this.analyser.frequencyBinCount;
    this.data = new Float32Array(this.size);
    this.db = new Float32Array(this.size);
    this.source = null;
    this.buffer = null;
    this.state = false;
  }
  async setFile(file) {
    const state = this.state;
    if (state) { this.stop(); }
    this.prop.file = file;
    this.buffer = await this.context.decodeAudioData(await this.prop.file.arrayBuffer());
    if (state) { this.play(); }
    return this;
  }
  play() {
    if (this.prop.type == "oscillator") {
      this.source = this.context.createOscillator();
      this.source.frequency.setValueAtTime(this.prop.hz, this.context.currentTime);
    } else if (this.prop.type == "buffer") {
      this.source = new AudioBufferSourceNode(this.context, { buffer: this.buffer, loop: true });
    }
    this.source.connect(this.analyser).connect(this.context.destination);
    this.source.start();
    this.state = true;
    return this;
  }
  stop() {
    this.source.stop();
    this.source = null;
    this.state = false;
    return this;
  }
  toggle() {
    if (this.state === false) {
      this.play();
    } else {
      this.stop();
    }
  }
  update() {
    this.analyser.getFloatFrequencyData(this.db);
    for (let i = 0; i < this.size; i++) {
      const data = (this.db[i] - this.analyser.minDecibels) / (this.analyser.maxDecibels - this.analyser.minDecibels);
      if (data >= 1) {
        this.data[i] = 1;
      } else if (data <= 0) {
        this.data[i] = 0;
      } else {
        this.data[i] = data;
      }
    }
    return this;
  }
}
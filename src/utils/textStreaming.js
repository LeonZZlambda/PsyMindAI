export class TextStreamer {
  constructor(text, onChunk, onComplete, reducedMotion = false) {
    this.text = text;
    this.onChunk = onChunk;
    this.onComplete = onComplete;
    this.reducedMotion = reducedMotion;
    this.currentIndex = 0;
    this.timeoutId = null;
  }

  start(delay = 800) {
    if (this.reducedMotion) {
      this.onChunk(this.text);
      this.onComplete();
      return;
    }

    setTimeout(() => this.streamNext(), delay);
  }

  streamNext() {
    if (this.currentIndex >= this.text.length) {
      this.onComplete();
      return;
    }

    const chunkSize = Math.floor(Math.random() * 3) + 1;
    const chunk = this.text.slice(this.currentIndex, this.currentIndex + chunkSize);
    
    this.onChunk(chunk);
    this.currentIndex += chunkSize;

    const delay = this.calculateDelay(chunk);
    this.timeoutId = setTimeout(() => this.streamNext(), delay);
  }

  calculateDelay(chunk) {
    let delay = 15 + Math.random() * 20;
    const lastChar = chunk[chunk.length - 1];
    
    if (['.', '!', '?', '\n'].includes(lastChar)) {
      delay += 300;
    } else if ([',', ';', ':'].includes(lastChar)) {
      delay += 150;
    }
    
    return delay;
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

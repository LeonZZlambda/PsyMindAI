export class TextStreamer {
  private text: string;
  private onChunk: (chunk: string) => void;
  private onComplete: () => void;
  private reducedMotion: boolean;
  private currentIndex: number;
  private timeoutId: NodeJS.Timeout | null;

  constructor(text: string, onChunk: (chunk: string) => void, onComplete: () => void, reducedMotion = false) {
    this.text = text;
    this.onChunk = onChunk;
    this.onComplete = onComplete;
    this.reducedMotion = reducedMotion;
    this.currentIndex = 0;
    this.timeoutId = null;
  }

  start(delay = 0): void {
    if (this.reducedMotion) {
      this.onChunk(this.text);
      this.onComplete();
      return;
    }

    this.timeoutId = setTimeout(() => this.streamNext(), delay);
  }

  private streamNext(): void {
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

  private calculateDelay(chunk: string): number {
    let delay = 15 + Math.random() * 20;
    const lastChar = chunk[chunk.length - 1];
    
    if (['.', '!', '?', '\n'].includes(lastChar)) {
      delay += 300;
    } else if ([',', ';', ':'].includes(lastChar)) {
      delay += 150;
    }
    
    return delay;
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

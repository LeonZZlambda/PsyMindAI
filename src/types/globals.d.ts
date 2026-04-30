export {};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    ClipboardItem: any;
  }

  interface ClipboardItem {
    readonly types: string[];
    getType(type: string): Promise<Blob>;
  }

  var Prism: {
    languages: {
      [key: string]: unknown;
    };
    highlight: (text: string, grammar: unknown, language: string) => string;
    highlightElement: (element: Element, async?: boolean, callback?: (element: Element) => void) => void;
    highlightAll: (async?: boolean, callback?: () => void) => void;
  };

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((this: SpeechRecognition, ev: any) => any) | null;
    onerror: ((this: SpeechRecognition, ev: any) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

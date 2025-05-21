import template from "./template.html?raw";
import styles from "./styles.css?raw";
import { AbstractWidget } from "../../abstract-widget.ts";

export class Widget extends AbstractWidget {
    private elements: WidgetElements;
    private recognition: any;
    private isListening: boolean = false;

    constructor(container: HTMLElement) {
        super(container);

        this.elements = {
            wrapper: this.host.getElementById('wrapper') as HTMLElement,
            button: this.host.getElementById('transcript-trigger') as HTMLButtonElement,
            result: this.host.getElementById('transcript-result') as HTMLOListElement,
            notSupported: this.host.getElementById('not-supported') as HTMLElement,
        };

        if (this.prepareRecognition()) {
            this.bindEvents()
        } else {
            this.displayNotSupportedWarning();
        }
    }

    protected getTemplate(): string|null {
        return template;
    }

    protected getStyles(): string | null {
        return super.getStyles() + styles;
    }

    private prepareRecognition(): boolean {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = 'fr-FR';
        this.recognition.interimResults = true;

        this.recognition.addEventListener('start', () => {
            this.isListening = true;
            this.elements.button.textContent = 'Arrêter la transcription';
        });

        this.recognition.addEventListener('end', () => {
            this.isListening = false;
            this.elements.button.textContent = 'Démarrer la transcription';
        });

        this.recognition.addEventListener('result', (event: any) => {
            this.transcript(event.results)
        });

        return true;
    }

    private bindEvents(): void {
        this.elements.button.addEventListener('click', () => {
            this.triggerTranscription();
        });
    }

    private triggerTranscription(): void {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    private transcript(results: SpeechRecognitionResult[]): void {
        let transcription = '';

        for (const result of results) {
            transcription += result[0].transcript;
        }

        this.elements.result.textContent = transcription;
    }

    private displayNotSupportedWarning(): void {
        this.elements.notSupported.classList.remove('hidden');
        this.elements.wrapper.classList.add('hidden');
    }
}

interface WidgetElements {
    wrapper: HTMLElement;
    button: HTMLButtonElement;
    result: HTMLOListElement;
    notSupported: HTMLElement;
}

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

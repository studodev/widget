import template from "./template.html?raw";
import styles from "./styles.css?raw";
import { AbstractWidget } from "../../abstract-widget.ts";

export class Widget extends AbstractWidget {
    private readonly directions = ['gauche', 'haut', 'droite', 'bas'];
    private elements: WidgetElements;
    private recognition: any;
    private isListening: boolean = false;

    constructor(container: HTMLElement) {
        super(container);

        this.elements = {
            wrapper: this.host.getElementById('wrapper') as HTMLElement,
            button: this.host.getElementById('trigger') as HTMLButtonElement,
            box: this.host.getElementById('box') as HTMLElement,
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

        this.recognition.addEventListener('start', () => {
            this.isListening = true;
            this.elements.button.textContent = 'Arrêter le contrôle vocal';
        });

        this.recognition.addEventListener('end', () => {
            this.isListening = false;
            this.elements.button.textContent = 'Démarrer le contrôle vocal';
        });

        this.recognition.addEventListener('result', (event: any) => {
            this.move(event.results)
        });

        return true;
    }

    private bindEvents(): void {
        this.elements.button.addEventListener('click', () => {
            this.triggerControl();
        });
    }

    private triggerControl(): void {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    private move(results: SpeechRecognitionResult[]): void {
        const lastResult = results[results.length - 1];

        if (!lastResult) {
            return;
        }

        const text = lastResult[0].transcript.toLowerCase().trim();

        for (const direction of this.directions) {
            if (!text.includes(direction)) {
                continue;
            }

            const styles = getComputedStyle(this.elements.box);
            let row = parseInt(styles.getPropertyValue('--row'));
            let column = parseInt(styles.getPropertyValue('--column'));

            switch (direction) {
                case 'haut':
                    row--;
                    break;
                case 'bas':
                    row++;
                    break;
                case 'gauche':
                    column--;
                    break;
                case 'droite':
                    column++;
                    break;
            }

            if (row < 1 || row > 4 || column < 1 || column > 4) {
                this.elements.box.classList.add('out');
                setTimeout(() => this.elements.box.classList.remove('out'), 500);

                return;
            }

            this.elements.box.style.setProperty('--row', row.toString());
            this.elements.box.style.setProperty('--column', column.toString());
        }
    }

    private displayNotSupportedWarning(): void {
        this.elements.notSupported.classList.remove('hidden');
        this.elements.wrapper.classList.add('hidden');
    }
}

interface WidgetElements {
    wrapper: HTMLElement;
    button: HTMLButtonElement;
    box: HTMLElement;
    notSupported: HTMLElement;
}

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

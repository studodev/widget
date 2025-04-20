import template from "./template.html?raw";
import styles from "./styles.css?raw";
import { AbstractWidget } from "../../abstract-widget.ts";

export class Widget extends AbstractWidget {
    private elements: WidgetElements;

    constructor(container: HTMLElement) {
        super(container);
        this.elements = this.buildElements();
        this.bindEvents();
        this.populateVoices();
    }

    protected getTemplate(): string|null {
        return template;
    }

    protected getStyles(): string | null {
        return super.getStyles() + styles;
    }

    private buildElements(): WidgetElements {
        return {
            form: this.host.querySelector('form') as HTMLFormElement,
            voiceSelect: this.host.querySelector('select[name="voice"]') as HTMLSelectElement,
        };
    }

    private bindEvents(): void {
        speechSynthesis.addEventListener('voiceschanged', () => {
            this.populateVoices();
        });

        this.elements.form.addEventListener('submit', e => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(this.elements.form).entries());
            this.say(data);
        });
    }

    private populateVoices(): void {
        const voices = speechSynthesis.getVoices();

        for (const voice of voices) {
            const option = document.createElement("option");
            option.textContent = `${voice.name} - ${voice.lang}`;
            option.value = voice.name;

            if (voice.lang === 'fr-FR') {
                option.selected = true;
            }

            this.elements.voiceSelect.appendChild(option);
        }
    }

    private say(data: Record<string, FormDataEntryValue>): void {
        const text = data.text !== '' ? String(data.text) : 'Tu peux saisir ton propre texte';
        const voice = this.findVoice(String(data.voice));

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.pitch = Number(data.pitch);
        utterance.rate = Number(data.rate);
        utterance.volume = Number(data.volume);

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }

    private findVoice(name: string) {
        const voices = speechSynthesis.getVoices();

        for (const voice of voices) {
            if (voice.name === name) {
                return voice;
            }
        }

        return voices[0];
    }
}

interface WidgetElements {
    form: HTMLFormElement;
    voiceSelect: HTMLSelectElement;
}

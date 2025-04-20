import template from "./template.html?raw";
import { AbstractWidget } from "../../abstract-widget.ts";

export class Widget extends AbstractWidget {
    constructor(container: HTMLElement) {
        super(container);
        this.bindEvents();
    }

    protected getTemplate(): string|null {
        return template;
    }

    private bindEvents(): void {
        this.host.querySelector('button')?.addEventListener('click', () => {
            this.sayHello();
        });
    }

    private sayHello(): void {
        const utterance = new SpeechSynthesisUtterance("Bonjour le monde");
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

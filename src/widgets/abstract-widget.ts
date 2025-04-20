import styles from "./abstract-widget.css?raw";

export abstract class AbstractWidget {
    protected host: ShadowRoot;

    protected constructor(container: HTMLElement) {
        this.host = this.mount(container);
    }

    private mount(container: HTMLElement): ShadowRoot {
        const shadow = container.attachShadow({ mode: 'closed' });

        const template = this.getTemplate();
        if (template) {
            shadow.innerHTML = template;
        }

        const styles = this.getStyles();
        if (styles) {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            shadow.appendChild(styleElement);
        }

        return shadow;
    }

    protected getTemplate(): string|null {
        return null;
    }

    protected getStyles(): string|null {
        return styles;
    }
}

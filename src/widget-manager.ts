import { widgetManifest, WidgetModule } from "./widget-manifest.ts";

export class WidgetManager {
    constructor() {
        this.buildWidgets();
    }

    buildWidgets(): void {
        const widgetContainers: HTMLElement[] = Array.from(document.querySelectorAll('[data-widget]'));

        for (const widgetContainer of widgetContainers) {
            const widgetName = widgetContainer.dataset.widget as string;
            const loader = widgetManifest[widgetName];
            loader().then(module => {
                this.buildWidget(module, widgetContainer);
            });
        }
    }

    buildWidget(widgetModule: WidgetModule, host: HTMLElement) {
        new widgetModule.Widget(host);
        delete host.dataset.state;
    }
}


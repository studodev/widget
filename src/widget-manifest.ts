import { AbstractWidget } from "./widgets/abstract-widget.ts";

const host = new URL(import.meta.url).origin;

export const widgetManifest: Record<string, () => Promise<WidgetModule>> = {
    'web-speech-api/hello-synthesis': () => import(`${host}/widgets/web-speech-api/hello-synthesis/index.js`),
};

export type WidgetModule = {
    Widget: new (host: HTMLElement) => AbstractWidget;
};

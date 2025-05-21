import { AbstractWidget } from "./widgets/abstract-widget.ts";

const host = new URL(import.meta.url).origin;

// TODO - Build manifest dynamically
export const widgetManifest: Record<string, () => Promise<WidgetModule>> = {
    'web-speech-api/hello-synthesis': () => import(`${host}/widgets/web-speech-api/hello-synthesis/index.js`),
    'web-speech-api/custom-synthesis': () => import(`${host}/widgets/web-speech-api/custom-synthesis/index.js`),
    'web-speech-api/live-transcription': () => import(`${host}/widgets/web-speech-api/live-transcription/index.js`),
};

export type WidgetModule = {
    Widget: new (host: HTMLElement) => AbstractWidget;
};

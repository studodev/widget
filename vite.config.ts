import { glob } from "glob";
import { resolve } from 'path';
import { defineConfig } from 'vite';

const widgetEntries = glob.sync('src/widgets/**/index.ts').reduce((entries, file) => {
    const entryKey = file
        .replace('src/', '')
        .replace('.ts', '')
    ;

    entries[entryKey] = resolve(__dirname, file);

    return entries;
}, {} as any);

const entries = {
    'widget': resolve(__dirname, 'src/main.ts'),
    ...widgetEntries
};

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            preserveEntrySignatures: 'strict',
            input: entries,
            output: {
                format: 'esm',
                entryFileNames: (chunkInfo) => {
                    return `${chunkInfo.name}.js`;
                }
            }
        }
    },
});


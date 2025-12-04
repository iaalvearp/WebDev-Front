/// <reference types="astro/client" />

import 'react';

declare module 'react' {
    interface HTMLAttributes<T> {
        "transition:animate"?: any;
        "transition:name"?: string;
        "transition:persist"?: boolean | string;
        class?: string;
    }
}

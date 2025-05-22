/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import App from './src/components/main/App.js';

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title: string) => `${title}`,

  resolve: (name: string) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, props }: { el: Element; props: any }) {
    createRoot(el).render(<App {...props} />);
    
  },
});
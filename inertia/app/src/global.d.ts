declare module "*.jsx" {
  import React from "react";
  const component: React.FC<any>;
  export default component;
}

declare module "*.js" {
  const value: any;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_REACT_APP_PAYPAL_CLIENT_ID: string
  readonly VITE_REACT_APP_READONLY_CONSUMER_KEY: string
  readonly VITE_REACT_APP_READONLY_CONSUMER_SECRET: string
  readonly VITE_REACT_APP_ENV: string
  readonly VITE_REACT_APP_DOMAIN: string
  readonly VITE_REACT_APP_GOOGLE_MAPS_KEY: string
  readonly VITE_REACT_APP_DEBUG_LOGGING: string
  readonly VITE_REACT_APP_PAYPAL_CLIENT_ID: string
  readonly VITE_REACT_APP_STRIPE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob: (pattern: string) => Record<string, () => Promise<unknown>>;
}

/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="@tanstack/react-query" />
/// <reference types="react-router-dom" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

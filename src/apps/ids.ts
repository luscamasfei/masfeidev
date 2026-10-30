/** Identifiers of every internal application. Kept free of imports to avoid cycles. */
export type AppId = 'terminal' | 'files' | 'project' | 'text' | 'about' | 'contact' | 'keys' | 'falsefy' | 'claude';

/** Parameters passed to an app instance (e.g. which file or directory to show). */
export type AppProps = Readonly<Record<string, string>>;

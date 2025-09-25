// This plugin is disabled by default to avoid build issues
// Use npm run build:prerender instead for prerendering
export function prerenderPlugin() {
  return {
    name: 'prerender-plugin',
    writeBundle() {
      console.log('ℹ️ Prerendering skipped during build. Use "npm run build:prerender" for prerendering.')
    }
  }
}

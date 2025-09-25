import { execSync } from 'child_process'
import path from 'path'

export function prerenderPlugin() {
  return {
    name: 'prerender-plugin',
    writeBundle() {
      console.log('🔄 Starting prerendering...')
      
      try {
        // Run the prerender script
        execSync('node scripts/prerender.js', { 
          stdio: 'inherit',
          cwd: process.cwd()
        })
        console.log('✅ Prerendering completed successfully!')
      } catch (error) {
        console.error('❌ Prerendering failed:', error.message)
        process.exit(1)
      }
    }
  }
}

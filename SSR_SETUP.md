# SSR (Server-Side Rendering) Setup for SEO

This document outlines the SSR implementation for Oentex to improve SEO and search engine visibility.

## Overview

The application now supports Server-Side Rendering (SSR) with the following benefits:
- **SEO Optimization**: All pages are pre-rendered with proper meta tags, structured data, and content
- **Faster Initial Load**: Critical content is rendered on the server
- **Search Engine Friendly**: Search engines can crawl and index all pages properly
- **Social Media Sharing**: Open Graph and Twitter Card meta tags are properly rendered

## Architecture

### Entry Points
- `src/entry-client.tsx` - Client-side hydration entry point
- `src/entry-server.tsx` - Server-side rendering entry point
- `src/main.tsx` - Updated to use client entry point

### Server
- `server.js` - Express server handling SSR and static file serving

### SEO Components
- `src/components/SEO.tsx` - Reusable SEO component with Helmet
- `src/lib/seoData.ts` - SEO data configuration for all pages

## Features Implemented

### 1. Meta Tags
- Title tags optimized for each page
- Meta descriptions with relevant keywords
- Open Graph tags for social media sharing
- Twitter Card meta tags
- Canonical URLs
- Robots meta tags (noindex for private pages)

### 2. Structured Data (JSON-LD)
- Website schema for homepage
- About page schema
- Contact page schema
- Dynamic deals list schema
- Organization schema

### 3. Page-Specific SEO
- **Home**: Trading deals and financial services focus
- **About**: Company information and mission
- **Deals**: Dynamic content with actual deals data
- **FAQ**: Help and support content
- **Contact**: Contact information and form
- **Terms/Privacy**: Legal pages (noindexed)
- **Authentication**: Login/register (noindexed)

## Build Process

### Development
```bash
npm run dev
```
Runs the standard Vite development server.

### Production Build
```bash
npm run build
```
This runs both client and server builds:
- `npm run build:client` - Builds client-side assets
- `npm run build:server` - Builds server-side entry point

### Production Server
```bash
npm run start
```
Starts the Express server with SSR support.

## Deployment

### Vercel Configuration
The `vercel.json` has been updated to support SSR:
- Server-side rendering via Node.js
- Static asset serving
- Proper caching headers
- Security headers

### Environment Variables
Make sure to set the following environment variables:
- `NODE_ENV=production` for production builds
- `PORT` for server port (defaults to 5173)

## SEO Best Practices Implemented

### 1. Content Optimization
- Unique, descriptive titles for each page
- Compelling meta descriptions (150-160 characters)
- Relevant keywords without stuffing
- Proper heading hierarchy (H1, H2, H3)

### 2. Technical SEO
- Canonical URLs to prevent duplicate content
- Proper robots.txt directives
- Fast loading times with code splitting
- Mobile-responsive design
- HTTPS ready

### 3. Structured Data
- Schema.org markup for better search understanding
- Rich snippets potential
- Local business information
- Product/service listings

### 4. Social Media Optimization
- Open Graph tags for Facebook/LinkedIn
- Twitter Card optimization
- Proper image dimensions and alt text
- Social sharing previews

## File Structure

```
src/
├── components/
│   └── SEO.tsx                 # SEO component
├── lib/
│   └── seoData.ts             # SEO data configuration
├── entry-client.tsx           # Client entry point
├── entry-server.tsx           # Server entry point
└── pages/guest/               # All pages with SEO
    ├── Home.tsx
    ├── About.tsx
    ├── Deals.tsx
    ├── FAQ.tsx
    ├── Contact.tsx
    ├── Terms.tsx
    ├── Privacy.tsx
    └── Authentication.tsx

server.js                      # Express server
vercel.json                    # Deployment config
```

## Testing SEO

### 1. Local Testing
```bash
npm run build
npm run start
```
Visit `http://localhost:5173` and view page source to verify meta tags.

### 2. SEO Tools
- Google Search Console
- Google PageSpeed Insights
- Facebook Sharing Debugger
- Twitter Card Validator
- Schema.org Validator

### 3. Lighthouse Audit
Run Lighthouse audit to check:
- Performance
- Accessibility
- Best Practices
- SEO score

## Maintenance

### Adding New Pages
1. Create the page component
2. Add SEO data to `src/lib/seoData.ts`
3. Import and use the SEO component
4. Update routing if needed

### Updating SEO Data
Modify `src/lib/seoData.ts` to update:
- Page titles and descriptions
- Keywords
- Structured data
- Social media tags

### Monitoring
- Monitor Core Web Vitals
- Track search rankings
- Check social media sharing
- Monitor page load times

## Performance Considerations

### Code Splitting
- Pages are lazy-loaded
- HeroUI components are chunked separately
- React libraries are optimized

### Caching
- Static assets cached for 1 year
- HTML pages cached appropriately
- CDN-ready for global distribution

### Bundle Size
- Client bundle optimized
- Server bundle minimal
- Tree shaking enabled

## Security

### Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Content Security
- No inline scripts in SSR
- External resources properly referenced
- HTTPS enforcement ready

## Troubleshooting

### Common Issues

1. **Meta tags not showing**: Check if SEO component is imported and used
2. **Structured data errors**: Validate JSON-LD syntax
3. **Build failures**: Ensure all dependencies are installed
4. **Server not starting**: Check port availability and environment variables

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages.

## Future Enhancements

### Planned Features
- Dynamic meta tags based on content
- Image optimization for social sharing
- Advanced structured data (reviews, ratings)
- Multi-language support
- AMP pages for mobile

### Performance Improvements
- Edge-side rendering
- Incremental static regeneration
- Advanced caching strategies
- CDN optimization

---

This SSR implementation provides a solid foundation for SEO while maintaining the existing functionality and user experience.

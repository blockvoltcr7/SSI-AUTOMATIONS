# Research: Meta Business Suite Domain Verification

## Overview
Research findings for implementing Meta Business Suite domain verification in a Next.js 14 application using the App Router.

## Key Decisions

### 1. Implementation Method
**Decision**: Use Next.js Metadata API in root layout
**Rationale**:
- Native Next.js approach for meta tags
- Ensures server-side rendering
- Works consistently across all pages
- Type-safe with TypeScript
**Alternatives considered**:
- Custom Head component: More complex, less idiomatic
- _document.tsx: Only available in Pages Router, not App Router
- Individual page metadata: Would miss non-page routes

### 2. Environment-Specific Deployment
**Decision**: Use environment variable check for production-only deployment
**Rationale**:
- Prevents tag from appearing in development/staging
- Follows security best practices
- Easy to configure per environment
**Alternatives considered**:
- Hardcoding with build-time checks: Less flexible
- Feature flags: Over-engineered for single tag

### 3. Verification Tag Placement
**Decision**: Add to root layout.tsx metadata export
**Rationale**:
- Guaranteed to be on homepage
- Single source of truth
- Easy to maintain and update
**Alternatives considered**:
- Homepage-only metadata: Risk of missing if routing changes
- Multiple locations: Unnecessary duplication

### 4. Testing Approach
**Decision**: Integration tests to verify HTML output
**Rationale**:
- Validates actual rendered output
- Can check for exact tag format
- Works in CI/CD pipeline
**Alternatives considered**:
- Unit tests only: Wouldn't verify actual HTML rendering
- Manual testing only: Not repeatable or automated

## Technical Specifications

### Meta Tag Format
```html
<meta name="facebook-domain-verification" content="yb8e406dpnvzbn2gxsmdivpf1sjpny5" />
```

### Next.js Metadata Implementation
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
  }
}
```

### Environment Check
```typescript
const isProduction = process.env.NODE_ENV === 'production' &&
                     process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
```

## Best Practices

### Meta Business Suite Requirements
- Tag must be in `<head>` section
- Content value must match exactly (case-sensitive)
- Tag must be present on initial HTML response
- Domain must be accessible to Meta crawlers

### Next.js Considerations
- Use metadata API for App Router applications
- Ensure server-side rendering for SEO/crawler visibility
- Avoid client-side injection of meta tags
- Test in production-like environment

## Verification Process
1. Deploy changes to production
2. View page source to confirm tag presence
3. Use Meta Business Suite verification tool
4. Monitor for successful verification status

## Potential Issues & Solutions
- **Issue**: Tag not detected by Meta
  - **Solution**: Check exact formatting, ensure no typos
- **Issue**: Verification fails despite tag presence
  - **Solution**: Check Meta crawler access, robots.txt, firewall rules
- **Issue**: Tag appears in development
  - **Solution**: Implement environment checks properly

## References
- [Next.js Metadata API Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Meta Business Suite Domain Verification](https://www.facebook.com/business/help/286768115176155)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application)
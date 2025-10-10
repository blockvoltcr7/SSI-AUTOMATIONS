# Meta Business Suite Domain Verification

## Overview

This document outlines the implementation of Meta Business Suite domain verification for the SSI Automations platform. The verification enables Facebook/Meta integrations and business features by proving domain ownership through a meta tag approach.

## Implementation Details

### Metadata API Approach

The verification is implemented using Next.js 13+ App Router's metadata API, which provides a clean, declarative way to manage meta tags:

- **Location**: `/app/layout.tsx`
- **Method**: Conditional metadata export based on environment
- **Tag Type**: `<meta name="facebook-domain-verification" content="token">`

### Code Implementation

```typescript
// Production-only Meta Business Suite domain verification
// Required for Facebook/Meta integrations and business features
// Verification token obtained from Meta Business Suite dashboard
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  // ... other metadata
  ...(isProduction && {
    other: {
      "facebook-domain-verification": "your_verification_token_here",
    },
  }),
};
```

## Environment Configuration

### Production-Only Deployment

The Meta verification tag is configured to appear **only in production** for the following reasons:

1. **Security**: Prevents token exposure in development/staging environments
2. **Accuracy**: Meta only verifies the actual production domain
3. **Best Practice**: Follows Meta's recommendation for domain verification

### Environment Variables

No additional environment variables are required. The implementation uses:

- `NODE_ENV === 'production'` for environment detection
- Hardcoded verification token (as provided by Meta Business Suite)

## Verification Steps for Meta Business Suite

### 1. Initial Setup

1. Access Meta Business Suite dashboard
2. Navigate to Business Settings → Domains
3. Add your production domain (`ssiautomations.com`)
4. Select "Meta tag" as verification method
5. Copy the provided verification token

### 2. Implementation

1. Update `/app/layout.tsx` with the verification token
2. Deploy to production environment
3. Ensure the meta tag appears in the HTML source

### 3. Verification Process

1. Return to Meta Business Suite dashboard
2. Click "Verify Domain" for your domain entry
3. Meta will crawl your production site looking for the meta tag
4. Verification typically completes within 24 hours

### 4. Confirmation

- Check Business Suite for "Verified" status
- Monitor for any verification failure notifications
- Test Meta integrations if applicable

## Troubleshooting Guide

### Common Issues

#### Meta Tag Not Found

**Symptoms**: Meta reports unable to find verification tag
**Solutions**:

1. Verify production deployment is live
2. Check that `NODE_ENV=production` in production environment
3. Inspect HTML source for presence of meta tag
4. Clear CDN/cache if applicable

#### Verification Token Mismatch

**Symptoms**: Tag found but verification fails
**Solutions**:

1. Re-copy token from Meta Business Suite
2. Check for extra spaces or characters in token
3. Ensure token is exactly as provided by Meta

#### Development Environment Issues

**Symptoms**: Meta tag appearing in development
**Solutions**:

1. Verify environment detection logic
2. Check `NODE_ENV` value in development
3. Restart development server after changes

#### Deployment Issues

**Symptoms**: Tag not appearing after deployment
**Solutions**:

1. Verify build process includes metadata
2. Check production environment variables
3. Review deployment logs for errors
4. Test with curl/wget to verify HTML output

### Verification Commands

```bash
# Check if meta tag is present in production
curl -s https://ssiautomations.com | grep -i "facebook-domain-verification"

# Verify environment detection locally
echo $NODE_ENV

# Check Next.js build output
npm run build
```

## Rollback Instructions

### Immediate Rollback

If verification causes issues:

1. **Quick Fix**: Comment out the verification metadata

```typescript
// Temporarily disabled - Meta verification
// ...(isProduction && {
//   other: {
//     'facebook-domain-verification': 'your_token_here'
//   }
// })
```

2. **Deploy Immediately**: Push changes to production
3. **Verify Removal**: Check HTML source for tag removal

### Complete Removal

To permanently remove Meta verification:

1. Remove the entire conditional metadata block
2. Remove related comments
3. Update this documentation
4. Notify Meta Business Suite if domain verification is no longer needed

### Revert Git Changes

```bash
# If changes are in a feature branch
git checkout main
git branch -D verify-meta-tag

# If changes are committed to main
git revert <commit-hash>
```

## Additional Notes

### Meta Business Suite Features

With domain verification, the following features become available:

- Facebook Pixel implementation
- Conversions API setup
- Business Manager integrations
- Advanced advertising features

### Security Considerations

- Verification token is public (appears in HTML)
- Token is domain-specific and cannot be misused
- No sensitive data exposure through verification
- Regular monitoring recommended

### Maintenance

- Verification is permanent once completed
- No regular token rotation required
- Monitor Meta Business Suite for any verification status changes
- Keep documentation updated with any Meta policy changes

## Support Resources

- [Meta Business Suite Documentation](https://www.facebook.com/business/help)
- [Domain Verification Guide](https://www.facebook.com/business/help/321095062152754)
- [Next.js Metadata API Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

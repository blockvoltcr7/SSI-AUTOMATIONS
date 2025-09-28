# Quickstart: Meta Business Suite Domain Verification

## Prerequisites
- Access to the Next.js project repository
- Ability to deploy to production (ssiautomations.com)
- Access to Meta Business Suite admin panel

## Implementation Steps

### Step 1: Add Meta Tag to Layout
1. Open `/app/layout.tsx` in your code editor
2. Locate or create the `metadata` export
3. Add the Facebook domain verification to the metadata:

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
  }
}
```

### Step 2: Add Environment Check (Optional)
If you want the tag only on production:

```typescript
const isProduction = process.env.NODE_ENV === 'production';

export const metadata: Metadata = {
  // ... existing metadata
  other: {
    ...(isProduction && {
      'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
    })
  }
}
```

### Step 3: Test Locally
1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. View page source (Right-click → View Page Source)
4. Search for "facebook-domain-verification"
5. Verify the tag is present and formatted correctly

### Step 4: Deploy to Production
1. Commit your changes:
   ```bash
   git add app/layout.tsx
   git commit -m "Add Meta Business Suite domain verification tag"
   ```
2. Push to your repository:
   ```bash
   git push origin main
   ```
3. Deploy to production (method varies by hosting provider)

### Step 5: Verify Tag on Production
1. Visit https://ssiautomations.com
2. View page source
3. Confirm the meta tag is present:
   ```html
   <meta name="facebook-domain-verification" content="yb8e406dpnvzbn2gxsmdivpf1sjpny5">
   ```

### Step 6: Complete Meta Business Suite Verification
1. Log in to Meta Business Suite
2. Navigate to Business Settings → Brand Safety → Domains
3. Click "Add" or find ssiautomations.com in your domains list
4. Click "Verify Domain"
5. Select "HTML tag" verification method
6. Click "Verify"
7. Wait for verification to complete (usually instant)

## Verification Checklist
- [ ] Meta tag added to layout.tsx
- [ ] Code committed and pushed
- [ ] Deployed to production
- [ ] Tag visible in production HTML source
- [ ] Meta Business Suite verification initiated
- [ ] Domain status shows "Verified"

## Troubleshooting

### Tag Not Appearing
- Check for typos in the metadata export
- Ensure you're checking the correct environment
- Clear browser cache and try again

### Verification Failing
- Verify exact spelling and case of attribute values
- Ensure no extra spaces or characters
- Check that the site is publicly accessible
- Try verification again after a few minutes

### Development vs Production
- Use environment variables to control tag visibility
- Test in production-like environment before deploying

## Success Criteria
- Meta tag renders in HTML `<head>` section
- Tag is visible to Meta's verification crawler
- Domain verification status changes to "Verified" in Meta Business Suite
- Tag persists across deployments

## Rollback Plan
If issues occur:
1. Remove the meta tag from layout.tsx
2. Redeploy the application
3. The domain will remain verified even if tag is removed later
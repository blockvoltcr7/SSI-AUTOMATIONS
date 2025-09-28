# HTML Output Contract: Meta Verification Tag

## Contract Definition
The rendered HTML output for the homepage must include the Meta Business Suite domain verification tag.

## Expected HTML Structure

### Location
The tag MUST appear within the `<head>` element of the HTML document.

### Format
```html
<meta name="facebook-domain-verification" content="yb8e406dpnvzbn2gxsmdivpf1sjpny5">
```

### Validation Rules

#### Required Attributes
1. **name**: Must be exactly `"facebook-domain-verification"`
2. **content**: Must be exactly `"yb8e406dpnvzbn2gxsmdivpf1sjpny5"`

#### Constraints
- Tag must be self-closing
- No additional attributes allowed
- Case-sensitive attribute values
- Must be present in server-side rendered HTML (not client-side injected)

## Test Contract

### Input
- URL: `https://ssiautomations.com/`
- Method: GET
- Headers: Standard browser headers

### Expected Output
HTML document containing:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Other meta tags -->
  <meta name="facebook-domain-verification" content="yb8e406dpnvzbn2gxsmdivpf1sjpny5">
  <!-- Rest of head content -->
</head>
<body>
  <!-- Page content -->
</body>
</html>
```

### Validation Steps
1. Fetch homepage HTML
2. Parse HTML document
3. Query for meta tag with name="facebook-domain-verification"
4. Verify content attribute matches exactly
5. Confirm tag is in <head> section

## Environment-Specific Behavior

### Production
- Tag MUST be present
- Full verification content included

### Development/Staging
- Tag SHOULD NOT be present (or optionally present for testing)
- Prevents accidental verification of non-production domains

## Error Cases
- Missing tag: Verification will fail
- Incorrect content value: Verification will fail
- Wrong attribute name: Meta crawler won't recognize tag
- Client-side only rendering: Meta crawler may not detect tag
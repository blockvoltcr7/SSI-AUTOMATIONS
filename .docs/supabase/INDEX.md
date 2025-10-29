# Supabase Documentation Index

Welcome to the SSI Automations Supabase documentation. This guide will help you navigate all Supabase-related documentation and understand how to work with the three-tier client architecture.

## Quick Navigation

| Document                                                 | Purpose                       | When to Read                   |
| -------------------------------------------------------- | ----------------------------- | ------------------------------ |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)               | Quick lookup, code snippets   | Daily development              |
| [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md)           | Comprehensive security guide  | Before implementing features   |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                     | Visual diagrams, architecture | Understanding the system       |
| [NEWSLETTER_FIX_SUMMARY.md](./NEWSLETTER_FIX_SUMMARY.md) | Implementation details        | Reference for similar features |

## Start Here

### New to the Project?

1. Start with [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Get up and running fast
2. Read [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) - Understand security model
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - See the big picture
4. Check `/lib/supabase/README.md` - Learn about available utilities

### Implementing a Feature?

1. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for code snippets
2. Review [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) for best practices
3. Look at [NEWSLETTER_FIX_SUMMARY.md](./NEWSLETTER_FIX_SUMMARY.md) for example implementation

### Troubleshooting?

1. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) "Common Errors" section
2. Review [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) "Troubleshooting" section
3. Verify environment variables are correctly configured
4. Check browser console and server logs

## Document Overview

### QUICK_REFERENCE.md (Essential - 6 KB)

**What's Inside:**

- Quick lookup table for client selection
- Code snippets for all common scenarios
- Authentication patterns
- Common errors and solutions
- Environment variable reference

**Best For:**

- Daily development reference
- Copy-paste code examples
- Quick problem solving
- Learning by example

**Key Sections:**

- Three client types comparison table
- Client Component examples
- Server Component examples
- API Route examples
- Real-time subscription examples
- Common errors and fixes

### SECURITY_PATTERNS.md (Comprehensive - 12 KB)

**What's Inside:**

- Complete security model explanation
- Three client types in detail
- Row Level Security best practices
- Real-world implementation patterns
- Security checklist
- Anti-patterns to avoid

**Best For:**

- Understanding security implications
- Making architectural decisions
- Reviewing code for security issues
- Training new team members
- Compliance and audit preparation

**Key Sections:**

- Three client characteristics
- When to use each client
- Environment variable security
- Common patterns and examples
- Security checklist
- Troubleshooting guide

### ARCHITECTURE.md (Visual - 8 KB)

**What's Inside:**

- Visual architecture diagrams
- Request flow diagrams
- Decision trees for client selection
- Client comparison tables
- Security flow diagrams
- Best practices summary

**Best For:**

- Understanding system architecture
- Onboarding new developers
- Planning new features
- Documenting system design
- Technical presentations

**Key Sections:**

- Architecture diagram
- Client characteristics
- Decision tree
- Real-world examples
- Security flow
- Best practices summary

### NEWSLETTER_FIX_SUMMARY.md (Reference - 10 KB)

**What's Inside:**

- Complete implementation walkthrough
- Problem statement and solution
- All code changes explained
- Testing procedures
- Production deployment guide
- Rollback plan

**Best For:**

- Understanding the newsletter implementation
- Reference for similar features
- Learning from real-world example
- Deployment planning
- Troubleshooting similar issues

**Key Sections:**

- Problem statement
- Solution overview
- Files created/modified
- Key changes explained
- Testing procedures
- Production deployment checklist
- Future considerations

## Common Tasks

### "I want to add a new feature"

1. **Determine where it runs:**
   - Client Component? → Use Browser Client
   - Server Component? → Use Server Client
   - API Route? → Probably Server Client (or Admin if no RLS)

2. **Check if RLS is needed:**
   - User-specific data? → Enable RLS, use Server/Browser Client
   - Public admin operations? → Disable RLS, use Admin Client

3. **Find example code:**
   - Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for snippets
   - Review [NEWSLETTER_FIX_SUMMARY.md](./NEWSLETTER_FIX_SUMMARY.md) for pattern

4. **Implement with security in mind:**
   - Follow patterns in [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md)
   - Use security checklist before deployment

### "My database operation isn't working"

1. **Identify the error:**
   - Check browser console (Client Components)
   - Check server logs (Server Components/API Routes)

2. **Common issues:**
   - RLS policy violation? → Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) "Common Errors"
   - Wrong client type? → Review [ARCHITECTURE.md](./ARCHITECTURE.md) decision tree
   - Missing env var? → Check [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) environment section

3. **Troubleshooting steps:**
   - Verify environment variables
   - Check if table has RLS enabled
   - Confirm client type is appropriate
   - Review RLS policies in Supabase dashboard

### "I need to understand the security model"

1. **Start with basics:**
   - Read [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) "Three Client Types" section
   - Review environment variable naming rules

2. **Understand each client:**
   - Browser Client: Public, RLS-protected, user context
   - Server Client: Server-side, RLS-protected, user context
   - Admin Client: Server-only, RLS-bypassed, no user context

3. **Review examples:**
   - [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) has 5+ real-world examples
   - [NEWSLETTER_FIX_SUMMARY.md](./NEWSLETTER_FIX_SUMMARY.md) shows complete implementation

4. **Apply security checklist:**
   - Use checklist from [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) before deploying

## File Locations

### Code

```
/lib/supabase/
├── admin.ts          # Admin client (service_role key)
├── client.ts         # Browser client (anon key)
├── server.ts         # Server client (anon key + cookies)
├── index.ts          # Exports all clients
└── README.md         # Library documentation
```

### Documentation

```
/.docs/supabase/
├── INDEX.md                    # This file
├── QUICK_REFERENCE.md          # Quick lookup (6 KB)
├── SECURITY_PATTERNS.md        # Security guide (12 KB)
├── ARCHITECTURE.md             # Visual diagrams (8 KB)
└── NEWSLETTER_FIX_SUMMARY.md   # Implementation reference (10 KB)
```

### Implementation

```
/app/api/newsletter/route.ts   # Example admin client usage
/app/dashboard/page.tsx         # Example server client usage
```

## Reading Order

### For New Team Members

**Day 1:**

1. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Get familiar with patterns
2. `/lib/supabase/README.md` - Understand available utilities
3. Run the newsletter feature locally

**Week 1:**

1. [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) - Deep dive on security
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand architecture
3. Review [NEWSLETTER_FIX_SUMMARY.md](./NEWSLETTER_FIX_SUMMARY.md) implementation

**Ongoing:**

- Reference [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) daily
- Review [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) before major features
- Keep security checklist handy

### For Code Reviews

**Checklist:**

1. Is the correct client type used? (Check [ARCHITECTURE.md](./ARCHITECTURE.md) decision tree)
2. Is user input validated? (Check [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md))
3. Are error messages safe? (No sensitive data leaked)
4. Is RLS appropriate? (Enable for user data, disable for admin-only)
5. Are env vars named correctly? (NEXT*PUBLIC* only for browser)

## Additional Resources

### Internal Documentation

- `/lib/supabase/README.md` - Supabase utilities documentation
- `/CLAUDE.md` - Project overview and development guide
- `/.docs/nextjs16/` - Next.js 16 migration documentation

### External Resources

- [Supabase Official Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## Contributing

When adding new Supabase features:

1. **Follow established patterns** from [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md)
2. **Update documentation** if introducing new patterns
3. **Add examples** to [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) if useful
4. **Use security checklist** before submitting PR

## Questions?

1. Check this INDEX.md for navigation
2. Review relevant documentation file
3. Search documentation for keywords
4. Check official Supabase docs
5. Ask in team chat

## Summary

This documentation provides everything you need to work with Supabase in the SSI Automations project:

- **QUICK_REFERENCE.md** - Your daily companion
- **SECURITY_PATTERNS.md** - Your security guide
- **ARCHITECTURE.md** - Your big picture view
- **NEWSLETTER_FIX_SUMMARY.md** - Your implementation example

Start with QUICK_REFERENCE.md and reference others as needed. Happy coding!

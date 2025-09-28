# Tasks: Add Meta Business Suite Domain Verification

**Input**: Design documents from `/specs/001-add-meta-business/`
**Prerequisites**: plan.md (required), research.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript 5.x, Next.js 14.2.15, App Router
2. Load optional design documents:
   → contracts/html-output.contract.md: HTML verification test needed
   → research.md: Metadata API approach confirmed
   → quickstart.md: Implementation steps defined
3. Generate tasks by category:
   → Setup: Test environment configuration
   → Tests: HTML output contract test
   → Core: Metadata implementation in layout.tsx
   → Configuration: Production environment check
   → Polish: Documentation and verification
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → HTML contract has test? ✓
   → Meta tag implementation? ✓
   → Environment configuration? ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `app/` for application code
- **Tests**: `tests/` at repository root
- Path structure based on plan.md

## Phase 3.1: Setup
- [x] T001 Set up test environment for Next.js integration testing with Jest and React Testing Library
- [x] T002 [P] Install testing dependencies: @testing-library/react, @testing-library/jest-dom, jest-environment-jsdom

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T003 [P] Create HTML contract test in tests/integration/meta-verification.test.ts to verify meta tag presence in rendered HTML
- [x] T004 [P] Create environment-specific test in tests/integration/environment-check.test.ts to verify production-only deployment

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T005 Add Meta verification tag to app/layout.tsx metadata export with 'facebook-domain-verification' in other property
- [x] T006 Add production environment check to conditionally include meta tag only on production domain

## Phase 3.4: Integration & Verification
- [x] T007 Test local development server to verify meta tag appears in HTML head section
- [x] T008 Run integration tests to ensure all contracts pass and tag renders correctly

## Phase 3.5: Polish & Documentation
- [x] T009 [P] Create deployment documentation in docs/meta-verification.md with verification steps
- [x] T010 [P] Add comments to layout.tsx explaining the meta tag purpose and verification process
- [x] T011 Verify production deployment readiness and create git commit with descriptive message

## Dependencies
- T001 blocks T003-T004 (need test environment first)
- Tests (T003-T004) must be complete and failing before implementation (T005-T006)
- T005 blocks T006 (need base implementation before environment check)
- T005-T006 block T007-T008 (need implementation before verification)
- All implementation complete before documentation (T009-T010)

## Parallel Example
```
# After T001, launch T003-T004 together:
Task: "Create HTML contract test in tests/integration/meta-verification.test.ts"
Task: "Create environment test in tests/integration/environment-check.test.ts"

# Documentation tasks T009-T010 can run in parallel:
Task: "Create deployment documentation in docs/meta-verification.md"
Task: "Add comments to layout.tsx explaining meta tag purpose"
```

## Notes
- This is a simple, focused feature with minimal tasks
- The meta tag is a single line addition but requires proper testing
- Environment checks are optional but recommended for production-only deployment
- Tests must fail first to follow TDD principles
- Commit after implementation is verified

## Task Execution Details

### T001: Test Environment Setup
- Configure Jest for Next.js App Router
- Set up jsdom for HTML testing
- Create jest.config.js if not exists

### T003: HTML Contract Test
```typescript
// Verify meta tag presence
// Check exact attribute values
// Ensure tag is in <head> section
// Test server-side rendering
```

### T005: Core Implementation
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
  }
}
```

### T006: Environment Configuration
```typescript
const isProduction = process.env.NODE_ENV === 'production';
// Conditionally include meta tag
```

## Validation Checklist
*GATE: Checked before task execution*

- [x] HTML contract has corresponding test (T003)
- [x] No data entities (confirmed in data-model.md)
- [x] Tests come before implementation (T003-T004 before T005-T006)
- [x] Parallel tasks are truly independent
- [x] Each task specifies exact file path
- [x] No parallel tasks modify the same file

## Success Criteria
- Meta tag visible in production HTML source
- Tests pass for HTML contract validation
- Environment-specific deployment works correctly
- Meta Business Suite can verify the domain
- Documentation complete for future reference
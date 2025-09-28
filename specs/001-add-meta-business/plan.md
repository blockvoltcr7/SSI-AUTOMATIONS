
# Implementation Plan: Add Meta Business Suite Domain Verification

**Branch**: `001-add-meta-business` | **Date**: 2025-09-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-meta-business/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add a Meta Business Suite domain verification meta tag to the Next.js application to verify ownership of ssiautomations.com domain. The tag must be rendered server-side in the HTML head section with the exact verification content provided by Meta.

## Technical Context
**Language/Version**: TypeScript 5.x / Next.js 14.2.15
**Primary Dependencies**: Next.js, React 18, TypeScript
**Storage**: N/A (no data storage required)
**Testing**: Jest + React Testing Library (standard Next.js testing)
**Target Platform**: Web (production domain: ssiautomations.com)
**Project Type**: web - Next.js application with App Router
**Performance Goals**: Maintain Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
**Constraints**: Tag must be server-side rendered, production-only deployment
**Scale/Scope**: Single meta tag addition, minimal impact

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component-First**: Meta tag will be added via metadata API or component approach
- [x] **Type Safety**: Minimal types needed, Next.js metadata types will be used
- [x] **Test Coverage**: Test strategy will verify tag presence in rendered HTML
- [x] **Performance**: No performance impact expected (single meta tag)
- [x] **Security**: No security concerns (public verification tag, no user data)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
app/
├── layout.tsx           # Root layout file where meta tag will be added
├── (marketing)/
│   └── page.tsx        # Homepage that needs verification
└── api/
    └── contact/
        └── route.ts

tests/
├── integration/
│   └── meta-verification.test.ts
└── e2e/
    └── meta-tag.spec.ts
```

**Structure Decision**: Next.js App Router structure. The meta tag will be added to the root layout.tsx or through Next.js metadata API to ensure it appears on the homepage.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - ✅ No NEEDS CLARIFICATION items found
   - ✅ Next.js metadata best practices researched
   - ✅ Meta verification requirements researched

2. **Research completed**:
   - Implementation method: Next.js Metadata API
   - Environment handling: Production-only checks
   - Testing approach: Integration tests

3. **Findings consolidated** in `research.md`:
   - Decision: Use root layout.tsx metadata export
   - Rationale: Native Next.js approach, SSR guaranteed
   - Alternatives: Custom Head component, _document.tsx (not available)

**Output**: ✅ research.md completed

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Data model analysis** → `data-model.md`:
   - ✅ No entities required (static configuration only)
   - ✅ Documented configuration token
   - ✅ Environment variables identified

2. **HTML output contract** → `/contracts/`:
   - ✅ Created html-output.contract.md
   - ✅ Defined expected HTML structure
   - ✅ Validation rules specified

3. **Test scenarios extracted**:
   - ✅ HTML tag presence verification
   - ✅ Production-only deployment check
   - ✅ Meta crawler accessibility test

4. **Quickstart guide created** → `quickstart.md`:
   - ✅ Step-by-step implementation guide
   - ✅ Verification checklist
   - ✅ Troubleshooting section

5. **Agent context updated**:
   - ✅ Ran update-agent-context.sh for copilot
   - ✅ Created .github/copilot-instructions.md
   - ✅ Added TypeScript/Next.js context

**Output**: ✅ All Phase 1 artifacts generated

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from quickstart.md steps
- HTML contract → verification test task
- Metadata implementation → core implementation task
- Environment checks → configuration task

**Expected Tasks**:
1. Setup: Initialize test environment
2. Test First: Create HTML verification test (TDD)
3. Implementation: Add meta tag to layout.tsx
4. Configuration: Add production environment check
5. Verification: Integration test execution
6. Documentation: Update deployment notes

**Ordering Strategy**:
- TDD order: Tests before implementation
- Simple linear flow (minimal dependencies)
- Few parallel opportunities due to simplicity

**Estimated Output**: 6-8 focused tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (one remains: staging environments)
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*

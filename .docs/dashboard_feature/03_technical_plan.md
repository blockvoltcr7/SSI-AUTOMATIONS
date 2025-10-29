# 03: Technical Plan

This document outlines the technical strategy for implementing the Developer Dashboard and Talent Marketplace.

---

### 1. File Structure

New components and pages will be organized as follows:

- **Main Dashboard Page:** `app/dashboard/page.tsx`
  - This will be the primary layout component that assembles the different sections of the dashboard.

- **Dashboard Components:** `components/dashboard/`
  - `ProfileSection.tsx`: Displays the user's profile summary and completeness.
  - `Marketplace.tsx`: Contains the project feed, search, and filtering logic.
  - `ActivityTracker.tsx`: Shows the user's applications and messages.
  - `ProjectCard.tsx`: A reusable component for displaying a single project in the marketplace feed.
  - `SkillTag.tsx`: A reusable component for displaying technology skills.

- **Profile Page:** `app/profile/[username]/page.tsx`
  - The public-facing profile page for a developer.

- **Profile Edit Page:** `app/dashboard/profile/edit/page.tsx`
  - A form for creating and updating the user's profile.

---

### 2. Data Models (TypeScript Interfaces)

We will use the following TypeScript interfaces to model our data.

```typescript
interface UserProfile {
  id: string; // Corresponds to Supabase auth user id
  username: string;
  avatar_url?: string;
  full_name: string;
  bio?: string;
  availability: "Available" | "Booked" | "Open to Offers";
  skills: Skill[];
  portfolio: PortfolioItem[];
}

interface Skill {
  id: number;
  name: string; // e.g., "Vercel", "Supabase"
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  project_url?: string;
  github_url?: string;
  technologies: Skill[];
}

interface Project {
  id: number;
  client_id: string;
  title: string;
  description: string;
  required_skills: Skill[];
  budget_min?: number;
  budget_max?: number;
  status: "Open" | "In Progress" | "Closed";
}

interface Application {
  id: number;
  project_id: number;
  developer_id: string;
  status: "Submitted" | "In Review" | "Interviewing" | "Offer" | "Rejected";
}
```

---

### 3. Supabase Backend

We will need to create the following tables in Supabase to support the data models:

- `profiles`: Stores public user profile data, linked one-to-one with `auth.users`.
- `projects`: Stores all client projects.
- `skills`: A central table for all available technology skills.
- `profile_skills`: A many-to-many join table linking `profiles` and `skills`.
- `project_skills`: A many-to-many join table linking `projects` and `skills`.
- `portfolio_items`: Stores developer portfolio projects, linked to `profiles`.
- `applications`: Tracks which developers have applied to which projects.

Row-Level Security (RLS) policies will be critical to ensure users can only access and modify their own data.

---

### 4. Implementation Phases

1.  **Phase 1: Profile Foundation**
    - Create the Supabase tables (`profiles`, `skills`, `profile_skills`, `portfolio_items`).
    - Build the profile editing page (`app/dashboard/profile/edit/page.tsx`).
    - Build the `ProfileSection` component for the main dashboard.
    - Build the public profile page (`app/profile/[username]/page.tsx`).

2.  **Phase 2: Project Marketplace**
    - Create the `projects` and `project_skills` tables.
    - Build the `Marketplace.tsx` component with project feed and filtering.

3.  **Phase 3: Application & Activity**
    - Create the `applications` table.
    - Implement the "Apply" functionality.
    - Build the `ActivityTracker.tsx` component.

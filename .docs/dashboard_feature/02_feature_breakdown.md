# 02: Feature Breakdown

This document details the components and features of the Developer Dashboard.

---

### 1. My Profile: Your Professional Showcase
This is the user's public-facing resume that clients will see. A complete and professional profile is key to being discovered.

- **Profile Completeness:** A visual progress bar to encourage users to fill out all details.
- **Core Competencies:** A tag-based system for selecting skills. This is the primary mechanism for matching developers to projects.
  - **Categories:** Platforms, Cloud Providers, Specialties, Frameworks.
  - **Example Tags:** `Vercel`, `Supabase`, `AWS`, `Google Cloud`, `AI Agent Development`, `AI-Native Apps`, `Next.js`, `Vector Databases`.
- **Availability Status:** A user-updatable status with options like `Available for Projects`, `Fully Booked`, `Open to Offers`.
- **Portfolio Section:** A dedicated area to showcase past work.
  - Each portfolio item will have a title, description, link to a live demo or GitHub, and associated technology tags.
- **Quick Actions:** Prominent buttons to `[ Edit Profile ]` and `[ View Public Profile ]`.

---

### 2. Project Marketplace: Find Your Next Gig
This is the interactive hub for discovering and filtering open projects.

- **Project Feed:** A list or card-based view of all open projects.
  - **Card Details:** Each project card will display the Project Title, Client Name, Required Skills, Budget/Rate, and Posted Date.
- **Advanced Filtering & Search:**
  - **Filter by Skills:** Checkboxes or a multi-select dropdown to filter by core technologies.
  - **Filter by Budget:** A slider or input fields for budget range.
  - **Filter by Project Type:** `Contract`, `Part-time`, `Full-time`.
  - **Keyword Search:** A text input to search project titles and descriptions.
- **Saved Searches / Alerts:** A feature allowing users to save a set of filters and receive email notifications for new matching projects.

---

### 3. My Activity: Track Your Journey
This section provides tools to manage the application and communication process.

- **My Applications:** A table that tracks all submitted applications.
  - **Columns:** Project Name, Client, Date Applied, Status.
  - **Statuses:** `Submitted`, `In Review`, `Interviewing`, `Offer Received`, `Rejected`, `Hired`.
- **Client Messages:** A simple, built-in messaging system for initial communications with potential clients.

---

### Visual Concept (Text Mockup)

```
/---------------------------------------------------------------------------
|  [SSI Automations Logo]      Dashboard      [ Profile Icon (John Doe) ▼ ] |
|---------------------------------------------------------------------------|
|
|  [ My Profile ]                       [ Availability: Available ▼ ]       |
|   Profile is 80% complete. Add portfolio to stand out.                    |
|   [ Edit Profile ] [ View Public Link ]                                   |
|
|---------------------------------------------------------------------------|
|
|  [ Recommended For You ]                                                  |
|   - [ AI Chatbot for E-commerce | Vercel, Supabase | $$$ ]                 |
|   - [ Data Processing Agent | AWS, AI | $$ ]                              |
|
|---------------------------------------------------------------------------|
|
|  [ Project Marketplace ]                                                  |
|   Search: [ai agent_________________]  Filter by Skill: [Supabase ▼]      |
|
|   [ CARD 1: Project Title, Skills, Budget ]  [ APPLY ]                    |
|   [ CARD 2: Project Title, Skills, Budget ]  [ APPLY ]                    |
|   [ CARD 3: Project Title, Skills, Budget ]  [ APPLY ]                    |
|
\---------------------------------------------------------------------------/
```

```
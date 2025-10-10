# Project Overview

This is a Next.js project that serves as a marketing website and blog for SSI Automations. It is built with TypeScript, Tailwind CSS, and uses MDX for blog content. The project is configured to be deployed on Vercel.

## Key Technologies

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** [MDX](https://mdxjs.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Testing:** [Jest](https://jestjs.io/)

## Project Structure

- `app/`: Contains the main application logic, including layouts and pages.
  - `app/(marketing)/`: Contains the marketing pages.
  - `app/api/`: Contains the API routes.
- `components/`: Contains the reusable React components.
- `content/`: Contains the MDX files for the blog posts.
- `lib/`: Contains the utility functions, such as the blog post parser.
- `public/`: Contains the static assets, such as images and fonts.

## Building and Running

### Development

To run the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building

To build the application for production, run the following command:

```bash
npm run build
```

### Testing

To run the tests, use the following command:

```bash
npm run test
```

## Development Conventions

- **Styling:** The project uses Tailwind CSS for styling. Utility classes should be used whenever possible.
- **Components:** Reusable components should be placed in the `components/` directory.
- **Blog Posts:** Blog posts are written in MDX and stored in the `content/blog/` directory. Each post should have a frontmatter section with the title, summary, date, author, authorImage, and thumbnail.
- **Linting:** The project uses ESLint to enforce code quality. Please run `npm run lint` before committing your changes.

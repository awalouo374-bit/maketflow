# Agent Rules

## Prompt Enhancement
When a single short prompt is received, automatically expand and enrich it before implementing. Infer intent, edge cases, and missing context — then act on the enhanced version.

## Icons
Never use emoji characters anywhere in the codebase. Use `react-icons` exclusively for all icons. Pick the most semantically appropriate icon from the library for each use case.

## Code Comments
Never write code comments. The code must be self-explanatory through naming and structure.

## Styling — Tailwind Only
Tailwind CSS is installed. Never write inline `style={{}}` props or `<style>` blocks inside `.tsx` files. Never write raw CSS in component files. All styling must use Tailwind utility classes. Global or shared styles that cannot be expressed with utilities go in the global CSS file only.

## Types
Never use `any`. When a type is unknown, use `unknown`. Always derive types from the Prisma schema — use the generated models as the source of truth for all entity types.

## Modular Structure
Never write long files. When a file grows beyond what a single responsibility demands, split it into focused component files. Every component that could be reused in more than one place must live in `src/components/shared/`.

## Clarification Before Implementation
When asked to create a new module without a clear structural spec, ask targeted questions before writing any code. Establish the expected routes, data shape, component breakdown, and interaction model first.

## Security Review
After implementing any module, perform a security audit on the code you just wrote. Identify and document every security issue created by that module — including but not limited to: missing authentication checks, unvalidated inputs, insecure direct object references, missing rate limiting, and data leakage risks.

## Reusable Components
When a component is used in two or more places, extract it immediately to `src/components/shared/` with its own clearly typed props interface.

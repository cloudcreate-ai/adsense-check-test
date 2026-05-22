/**
 * Fake page data fixtures for testing check functions.
 */

// Normal content site pages — substantial text, varied content
export const goodContentPages = [
  {
    url: 'https://example.com/',
    title: 'Example Blog',
    text: 'Welcome to Example Blog. We publish in-depth guides about web development, design patterns, and software engineering best practices.\n\nOur team of experienced developers shares practical tutorials covering React, Node.js, TypeScript, and cloud infrastructure. Each article is reviewed by subject matter experts before publication.\n\nRecent highlights include a comprehensive guide to building REST APIs with Express and PostgreSQL, a deep dive into React Server Components, and an analysis of modern CSS layout techniques.\n\nWe believe in learning by doing. Every tutorial includes working code examples, test coverage, and deployment instructions. Our readers range from beginners looking for their first project to senior engineers exploring new tools.\n\nContact us at editor@example.com for collaboration opportunities.',
  },
  {
    url: 'https://example.com/about',
    title: 'About Us',
    text: 'Example Blog was founded in 2020 by a team of software engineers who wanted to share practical development knowledge with the community. Our mission is to provide high-quality, well-tested tutorials that developers can actually use in production.\n\nOur editorial team consists of senior engineers from leading tech companies. Every article undergoes peer review and fact-checking before publication.\n\nWe cover topics including frontend development, backend systems, DevOps practices, and software architecture.',
  },
  {
    url: 'https://example.com/privacy',
    title: 'Privacy Policy',
    text: 'This Privacy Policy describes how Example Blog collects, uses, and shares your personal information when you visit our website.\n\nWe collect information you provide directly, such as when you subscribe to our newsletter or contact us. We also collect technical data including IP addresses, browser type, and pages viewed through our analytics provider.\n\nWe use this information to improve our content, send newsletters (with your consent), and analyze site usage. We do not sell your personal information to third parties.\n\nYou may request deletion of your data at any time by contacting privacy@example.com.',
  },
  {
    url: 'https://example.com/contact',
    title: 'Contact',
    text: 'We\'d love to hear from you. Reach out to us through the following channels:\n\nEmail: hello@example.com\nTwitter: @exampleblog\nGitHub: github.com/example-blog\n\nFor editorial inquiries, please email editor@example.com. For advertising questions, contact ads@example.com.\n\nWe typically respond within 2 business days.',
  },
  {
    url: 'https://example.com/terms',
    title: 'Terms of Service',
    text: 'By accessing Example Blog, you agree to these terms. Content on this site is provided for educational purposes only.\n\nAll original content is licensed under Creative Commons BY-NC-SA 4.0 unless otherwise stated. Code examples are provided under the MIT License.\n\nWe reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms.',
  },
  {
    url: 'https://example.com/getting-started-react',
    title: 'Getting Started with React in 2024',
    text: 'React is the most popular JavaScript library for building user interfaces. This comprehensive guide will walk you through setting up a new React project from scratch.\n\nFirst, ensure you have Node.js 18 or later installed. Then create a new project using Vite, the modern build tool that has largely replaced Create React App:\n\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev\n\nThis gives you a development server with hot module replacement and a production build pipeline. Vite\'s dev server starts in under 500ms even for large projects.\n\nProject Structure\nThe default Vite React template creates a clean structure with src/App.jsx as your root component and src/main.jsx as the entry point.\n\nComponent Architecture\nReact applications are built from reusable components. Each component manages its own state and renders based on props. The key concepts are:\n\n- JSX syntax for writing HTML-like code in JavaScript\n- Props for passing data between components\n- State for managing component-level data with useState and useReducer\n- Effects for side effects with useEffect\n- Context for sharing data across the component tree\n\nBuilding Your First Component\nLet\'s create a simple counter component to demonstrate these concepts:\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n}\n\nThis component uses the useState hook to track the count value. When the button is clicked, React re-renders the component with the new state.\n\nConclusion\nReact\'s component model and hooks system make it straightforward to build complex UIs from simple, testable pieces. The ecosystem around React—including React Router, testing libraries, and component frameworks—makes it a powerful choice for production applications.',
  },
  {
    url: 'https://example.com/typescript-patterns',
    title: 'TypeScript Design Patterns',
    text: 'TypeScript adds static type checking to JavaScript, catching errors at compile time rather than runtime. This article explores practical TypeScript patterns used in production codebases.\n\nGeneric Constraints\nGenerics allow you to write flexible, reusable functions and classes while maintaining type safety:\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nThis function extracts a property value with full type inference. The compiler ensures you can only pass valid property keys.\n\nDiscriminated Unions\nOne of TypeScript\'s most powerful patterns is discriminated unions for representing different states:\n\ntype Result<T, E> =\n  | { ok: true; value: T }\n  | { ok: false; error: E };\n\nfunction fetchData(url: string): Result<Data, FetchError> {\n  // ...\n}\n\nThe "ok" field acts as a discriminant. TypeScript narrows the type based on its value, providing autocomplete and error checking for each branch.\n\nBuilder Pattern\nFor complex configuration objects, the builder pattern provides a fluent API:\n\nclass QueryBuilder {\n  private conditions: string[] = [];\n  private orderBy: string[] = [];\n  private limit?: number;\n\n  where(condition: string): this {\n    this.conditions.push(condition);\n    return this;\n  }\n\n  orderBy(field: string): this {\n    this.orderBy.push(field);\n    return this;\n  }\n\n  limit(count: number): this {\n    this.limit = count;\n    return this;\n  }\n\n  build(): string {\n    let query = \'SELECT *\';\n    if (this.conditions.length) query += ` WHERE ${this.conditions.join(\' AND \')}`;\n    if (this.orderBy.length) query += ` ORDER BY ${this.orderBy.join(\', \')}`;\n    if (this.limit) query += ` LIMIT ${this.limit}`;\n    return query;\n  }\n}\n\nThese patterns scale well from small projects to enterprise codebases. The type system catches refactoring errors, invalid property access, and mismatched types before they reach production.',
  },
];

// Thin content — pages with very little text
export const thinContentPages = [
  {
    url: 'https://thin.example.com/',
    title: 'Thin Site',
    text: 'Welcome. Click here for more.',
  },
  {
    url: 'https://thin.example.com/page1',
    title: 'Page 1',
    text: 'Lorem ipsum dolor sit amet.',
  },
  {
    url: 'https://thin.example.com/page2',
    title: 'Page 2',
    text: 'Coming soon. Stay tuned.',
  },
];

// Duplicate content — same template, different data
export const duplicateContentPages = [
  {
    url: 'https://dup.example.com/product-1',
    title: 'Product 1',
    text: 'This is a great product. It has many features. You will love it. Buy now for the best experience. Free shipping available. Contact us for support. Returns accepted within 30 days.',
  },
  {
    url: 'https://dup.example.com/product-2',
    title: 'Product 2',
    text: 'This is a great product. It has many features. You will love it. Buy now for the best experience. Free shipping available. Contact us for support. Returns accepted within 30 days.',
  },
  {
    url: 'https://dup.example.com/product-3',
    title: 'Product 3',
    text: 'This is a great product. It has many features. You will love it. Buy now for the best experience. Free shipping available. Contact us for support. Returns accepted within 30 days.',
  },
];

// Pages with policy-violating content
export const policyViolationPages = [
  {
    url: 'https://bad.example.com/casino',
    title: 'Best Online Casino',
    text: 'Welcome to the best online casino! Play blackjack, poker, and roulette with real money. Sign up now and get a 100% bonus on your first deposit up to $500. Our gambling platform offers the highest payout rates. Bet on sports, horse racing, and more. Gambling addiction hotline: 1-800-522-4700.',
  },
];

// Clean pages — no policy violations
export const cleanPages = [
  {
    url: 'https://clean.example.com/',
    title: 'Clean Blog',
    text: 'Welcome to Clean Blog. We share recipes, travel stories, and photography tips. Our latest post is about hiking in the Pacific Northwest. The trails are beautiful this time of year.',
  },
];

// Link info fixtures for required pages check
export const completeLinks = [
  { href: 'https://example.com/about', text: 'About Us' },
  { href: 'https://example.com/privacy', text: 'Privacy Policy' },
  { href: 'https://example.com/contact', text: 'Contact' },
  { href: 'https://example.com/terms', text: 'Terms of Service' },
];

export const missingPrivacyLinks = [
  { href: 'https://example.com/about', text: 'About Us' },
  { href: 'https://example.com/contact', text: 'Contact' },
];

export const missingContactLinks = [
  { href: 'https://example.com/about', text: 'About Us' },
  { href: 'https://example.com/privacy', text: 'Privacy Policy' },
];

WorkSmart AI

WorkSmart AI is a responsive workplace productivity dashboard powered by AI. It provides three focused AI tools—an Email Generator, Research Assistant, and AI Chatbot—through a clean, accessible, and professional interface.

The application is designed for lightweight productivity workflows without user accounts, persistent databases, or third-party API keys. Application state is maintained in memory for the duration of the session.

Project Overview

WorkSmart AI helps users complete common workplace tasks using AI while emphasizing responsible AI usage and transparency.

The application includes:

A responsive dashboard with quick access to the three AI productivity tools.

An AI-powered email generation tool with multiple tone options.

A research assistant for summarizing and analyzing user-provided content.

A conversational AI chatbot with session-based conversation context.

Light and dark theme support.

Responsible AI messaging and usage disclaimers throughout the application.

Accessible, responsive layouts for desktop, tablet, and mobile devices.

No login, database, or third-party API keys are required.

Features Implemented
Dashboard

Three quick-launch cards:

Email Generator

Research Assistant

AI Chatbot

One-line descriptions for each tool.

Navigation from each card to the relevant tool.

Responsible AI disclaimer banner.

Responsive Navigation

The sidebar contains exactly five navigation items in this order:

Dashboard

Email Generator

Research Assistant

AI Chatbot

Settings

Navigation behavior:

Desktop: 240px fixed sidebar.

Tablet: Icon-only navigation rail.

Mobile: Hamburger menu with a drawer.

Lucide icons are used throughout the navigation.

Email Generator

The Email Generator allows users to create workplace emails from a short description or list of key points.

Features include:

Context / Key Points textarea.

Maximum input length of 2,000 characters.

Tone selection:

Formal

Friendly

Persuasive

Generate button.

Generated output containing:

Subject

Greeting

Email body

Sign-off

Copy button.

Regenerate button.

Compare All Tones functionality.

Side-by-side tone comparison on desktop.

Stacked tone cards on mobile.

Original input remains intact when switching between tones.

Research Assistant

The Research Assistant supports two input modes:

Paste Text

Maximum of 20,000 characters.

Enter URL

URL validation occurs before making an AI request.

URL mode is explicitly labeled as best-effort.

Generated research output contains four clearly labeled sections:

Summary

3–5 sentences.

Key Insights

3–7 bullet points.

Recommendations

2–4 items.

Source

Identifies whether the response is based on user-provided text or model knowledge.

The system is instructed not to invent:

Authors

Dates

URLs

Sources

Additional functionality includes:

Copy button.

Regenerate button.

Loading and error states.

AI Chatbot

The AI Chatbot provides a conversational workspace with session-based context.

Features include:

Single full-width chat column across all screen sizes.

Scrolling conversation transcript.

User messages aligned to the right.

Assistant messages aligned to the left.

Distinct visual styling for user and assistant messages.

Copy button on every assistant message.

Multi-line input area.

Maximum input length of 4,000 characters.

Inline validation for invalid or oversized input.

Enter sends a message.

Shift + Enter creates a new line.

Conversation history is preserved during the current session.

Full message history is sent to the AI for contextual responses.

Typing indicator while the AI is generating a response.

Automatic scrolling to the newest message unless the user has manually scrolled upward.

Inline error messages with a Retry button.

Clear Conversation functionality protected by a confirmation dialog.

Empty State

The chatbot provides a short greeting and three quick prompts:

Brainstorm ideas

Rewrite this text

Check grammar

Selecting a quick prompt inserts a starter prompt into the chat input.

AI Behavior

The chatbot is instructed not to claim that it has:

Browsed the web.

Read files.

Sent emails or messages.

Performed actions it did not actually perform.

It must also avoid inventing sources or URLs.

Settings

The Settings page includes:

Light/dark mode toggle.

Static About & Responsible AI information panel.

Shared Tool States

The Email Generator and Research Assistant use a consistent responsive tool layout:

Desktop: Input panel on the left and output panel on the right.

Mobile: Panels stack vertically.

Supported output states include:

Empty: Instructions and an example.

Loading: Skeleton loading state.

Success: Generated AI content.

Error: Error message with Retry action.

Output panels use a light grey background with a visible border.

Accessibility

Accessibility considerations include:

Labels for form inputs.

Visible keyboard focus rings.

Good color contrast.

Responsive layouts.

Semantic interface elements.

Chat transcript configured as an aria-live region.

Keyboard-friendly chat interaction.

Clear validation and error messaging.

Design System

The application follows a clean, minimal, professional visual style.

Element	Specification
Primary color	#1E3A8A
Accent color	#0D9488
Font	Inter
Border radius	8px
Layout	Generous whitespace
Style	Clean, minimal, professional
Icons	Lucide
Responsible AI Disclaimer

A persistent footer appears on every view with the following message:

AI-generated content may be inaccurate, incomplete, or biased. Verify all critical information before use. Do not submit confidential or personal data.

The AI system prompts also instruct the model to:

Use neutral and inclusive language.

Avoid assumptions about gender.

Avoid assumptions about nationality.

Avoid assumptions about seniority.

Technologies and Tools Used
Frontend

React

TypeScript

Vite

Tailwind CSS

Lucide Icons

Inter font

AI / Generation

Lovable AI for application generation and AI functionality.

AI-powered generation for emails, research responses, and chatbot conversations.

Application Architecture

Client-side application state.

In-memory session state.

No user authentication.

No persistent database.

No third-party API keys required.

No persistent storage of conversations or generated content.

Responsive Design

The interface is designed around three primary responsive layouts:

Desktop

Tablet

Mobile

Components adapt their layout and navigation behavior based on screen size.

Setup Instructions
Prerequisites

Make sure you have the following installed:

Node.js

npm

A current LTS version of Node.js is recommended.

1. Clone the Repository
git clone <your-repository-url>
cd worksmart-ai


Replace <your-repository-url> with the URL of your GitHub repository.

2. Install Dependencies
npm install

3. Configure the Application

The application is designed to operate without user authentication, a database, or third-party API keys.

If the generated Lovable project requires environment variables for its AI backend, configure the variables according to the generated project's environment configuration and Lovable's setup.

Do not commit secrets or API keys to the repository.

4. Start the Development Server
npm run dev


The development server will provide a local URL, typically similar to:

http://localhost:5173


Open the URL in your browser to use WorkSmart AI.

5. Build for Production

Create a production build with:

npm run build


To preview the production build locally:

npm run preview

Project Structure

A typical project structure is:

worksmart-ai/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.*
├── tsconfig.json
└── README.md


The exact structure may vary depending on the project generated by Lovable.

Data & Privacy

WorkSmart AI does not require:

User accounts

A database

Persistent conversation storage

Third-party API keys

Application state is maintained in memory during the current session.

Users should not submit confidential, sensitive, or personal information into the AI tools.

AI Safety & Limitations

AI-generated content may contain errors, omissions, bias, or inaccurate information.

The application therefore emphasizes:

Verification of critical information.

Clear source labeling.

No fabricated authors, dates, or URLs.

No claims of web browsing or external actions that did not occur.

Neutral and inclusive language.

User responsibility for reviewing generated content before use.

The Research Assistant's URL mode is explicitly best-effort, and users should independently verify important information.

Navigation

The application uses the following navigation structure:

Dashboard
├── Email Generator
├── Research Assistant
├── AI Chatbot
└── Settings


The sidebar itself contains exactly:

1. Dashboard
2. Email Generator
3. Research Assistant
4. AI Chatbot
5. Settings

Disclaimer

WorkSmart AI is intended as a workplace productivity aid. AI-generated content should be reviewed by the user before being relied upon, shared, or used for important decisions.

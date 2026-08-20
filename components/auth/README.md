# Auth Components

This directory contains the new authentication UI components for Synchropia, designed with a developer-focused aesthetic.

## Components

### Layout Components
- `AuthCard.tsx` - Base card component with blur effect and proper spacing
- `AuthHeader.tsx` - Header with title and optional subtitle
- `AuthTabs.tsx` - Tab switcher for Sign In / Create Account

### Form Components
- `AuthInput.tsx` - Styled input with label, placeholder, validation, and error states
- `AuthButton.tsx` - Button with loading states, variants (primary/secondary/outline), and sizes

### Feedback Components
- `ToastNotifier.tsx` - Non-intrusive toast notifications for success/error/info
- `useToast.ts` - Hook for managing toast state

## Usage Example

```tsx
import { AuthCard, AuthHeader, AuthTabs, AuthInput, AuthButton } from "@/components/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome to Synchropia" subtitle="The Agentic Software Delivery Factory" />

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          placeholder="youremail@company.com"
          value={email}
          onChange={setEmail}
          error={error && "Invalid email"}
          required
        />

        <AuthButton type="submit" variant="primary">
          Sign In
        </AuthButton>
      </form>
    </AuthCard>
  );
}
```

## Design Principles

1. **Developer-Focused**: Clean, functional UI with subtle animations
2. **Accessibility**: Proper labeling, keyboard navigation, ARIA attributes
3. **Performance**: Minimal DOM nodes, efficient re-renders
4. **Consistency**: Uses Tailwind CSS utilities and CSS variables
5. **Feedback**: Clear validation, loading states, and success/error messages

## Color Scheme

Uses CSS variables from Tailwind configuration:
- Primary: Indigo (`--primary`)
- Secondary: Slate (`--secondary`)
- Accent: Indigo/Purple gradients
- Background: Dark/light mode aware
- Text: Foreground/muted-foreground

## Animation

Subtle micro-interactions:
- Input focus: label float + underline expand
- Button press: scale down + loading states
- Form submission: success/error animations
- Toast notifications: slide-in/fade-out

## Responsive Design

- Mobile: Full-width cards
- Tablet/Desktop: Centered cards with max-width
- All touch targets ≥44px
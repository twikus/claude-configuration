# React 19 Clean Code Best Practices

## New React 19 Hooks

### `use()` - Reading Promises and Context

Can be called conditionally (unlike other hooks):

```typescript
import { use } from 'react';

function Component({ shouldLoad }: { shouldLoad: boolean }) {
  let data = null;

  if (shouldLoad) {
    // use() can be called conditionally!
    data = use(fetchDataPromise);
  }

  return <div>{data}</div>;
}
```

### `useActionState()` - Form Actions

Replaces manual form state management:

```typescript
'use client';

import { useActionState } from 'react';

function LoginForm() {
  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData: FormData) => {
      const result = await login(formData);
      if (result.error) return result.error;
      redirect('/dashboard');
      return null;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### `useFormStatus()` - Form Submission State

Access form state from child components:

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form({ action }: { action: (data: FormData) => Promise<void> }) {
  return (
    <form action={action}>
      <input name="title" />
      <SubmitButton /> {/* Has access to form state */}
    </form>
  );
}
```

### `useOptimistic()` - Instant UI Updates

Show expected result immediately:

```typescript
'use client';

import { useOptimistic } from 'react';

function TodoList({ todos, addTodo }: Props) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const newTodo = { id: crypto.randomUUID(), title, completed: false };

    // Instantly show in UI
    addOptimisticTodo(newTodo);

    // Then persist to server
    await addTodo(newTodo);
  }

  return (
    <>
      <form action={handleSubmit}>
        <input name="title" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Refs Simplified (No More forwardRef)

React 19 allows `ref` as a regular prop:

```typescript
// OLD (React 18)
const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return <button ref={ref} {...props} />;
});

// NEW (React 19)
function Button({ ref, ...props }: Props & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} {...props} />;
}
```

---

## Document Metadata

Render metadata directly in components:

```typescript
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta name="author" content={post.author} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
// React automatically hoists to <head>
```

---

## React Compiler - No Manual Memoization

React 19 Compiler handles optimization automatically:

```typescript
// OLD (React 18) - Manual optimization
function ExpensiveComponent({ data, onClick }: Props) {
  const processed = useMemo(() => expensiveWork(data), [data]);
  const handleClick = useCallback(() => onClick(), [onClick]);

  return <Child data={processed} onClick={handleClick} />;
}
export default memo(ExpensiveComponent);

// NEW (React 19) - Let compiler optimize
function ExpensiveComponent({ data, onClick }: Props) {
  const processed = expensiveWork(data);

  return <Child data={processed} onClick={onClick} />;
}
```

---

## Component Patterns

### Keep Components Small

```typescript
// BAD - Giant component
function Dashboard() {
  // 300 lines of mixed concerns
}

// GOOD - Composed from smaller parts
function Dashboard() {
  return (
    <DashboardLayout>
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </DashboardLayout>
  );
}
```

### Server Actions for Mutations

```typescript
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({ data: { title, content } });
  revalidatePath('/posts');
}

// Component
'use client';

import { createPost } from './actions';

function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## Custom Hooks for Logic

```typescript
// Extract data fetching logic
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  });
}

// Extract form logic
function useLoginForm() {
  const [error, action, isPending] = useActionState(loginAction, null);

  return { error, action, isPending };
}

// Component becomes simple
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton />;
  return <ProfileCard user={user} />;
}
```

---

## State Management Decision Tree

| Scenario | Solution |
|----------|----------|
| Server state (API data) | TanStack Query |
| Global UI state | Zustand |
| Form state | useActionState + Server Actions |
| Local UI state | useState |
| Complex local state | useReducer |
| Optimistic updates | useOptimistic |

---

## Resource Preloading

```typescript
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function App() {
  // Critical script - load and execute immediately
  preinit('https://cdn.example.com/critical.js', { as: 'script' });

  // Font - preload for later use
  preload('https://fonts.example.com/font.woff2', { as: 'font' });

  // External API - early connection
  preconnect('https://api.example.com');

  // Third-party domain - DNS prefetch
  prefetchDNS('https://analytics.example.com');

  return <MainContent />;
}
```

---

## Suspense & Code Splitting

```typescript
import { Suspense, lazy } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const MarkdownEditor = lazy(() => import('./MarkdownEditor'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>

      <Suspense fallback={<EditorSkeleton />}>
        <MarkdownEditor />
      </Suspense>
    </div>
  );
}
```

---

## Error Boundaries

```typescript
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-50 rounded">
      <h2 className="font-bold text-red-800">Something went wrong</h2>
      <pre className="text-sm text-red-600">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router />
    </ErrorBoundary>
  );
}
```

---

## Activity Component (React 19.2+)

Better than conditional rendering:

```typescript
// OLD - Unmounts component
{isVisible && <HeavyComponent />}

// NEW - Keeps mounted but inactive
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <HeavyComponent />
</Activity>
```

Benefits:
- Deferred updates for hidden components
- Pre-rendering in background
- State preserved when hidden

---

## Anti-Patterns

| Pattern | Problem | Solution |
|---------|---------|----------|
| useEffect for fetching | No caching, race conditions | TanStack Query |
| useState for server data | Manual loading/error | TanStack Query |
| Props drilling 3+ levels | Hard to maintain | Zustand or Context |
| Giant components | Untestable | Split into smaller |
| Manual memoization | Verbose, error-prone | React Compiler |
| forwardRef | Verbose | ref as prop (React 19) |
| Manual form state | Boilerplate | useActionState |

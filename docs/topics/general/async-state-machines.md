---
title: "Async State Machines"
description: "How async/await compiles your method into a struct-based state machine that chains continuations."
date: "2026-06-03"
category: "general"
tags: ["async", "state-machines", "csharp", "compilation"]
level: "intermediate"
---

<TopicLayout
  title="Async State Machines"
  subtitle="How async/await compiles your method into a struct-based state machine that chains continuations."
  category="General"
  level="Intermediate"
  :tags="['Async', 'State Machines', 'C#', 'Compilation']"
  takeaway="async doesn't suspend threads — it compiles your method into a struct-based state machine that chains continuations, and every variable used across an await boundary becomes heap-allocated state."
>

## The False Abstraction

You write an async method with await, and it just works — pausing where you expect, resuming on the right thread, propagating exceptions cleanly. It feels like magic suspension.

```csharp
public async Task<string> FetchAndProcess()
{
    var data = await httpClient.GetAsync(url);
    return Process(data);
}
```

## What Actually Happens Underneath

The C# compiler doesn't suspend anything. There's no runtime "pause" primitive. Instead, it performs a source transformation — your method is rewritten into a struct that implements `IAsyncStateMachine`. Every await becomes a transition point in an implicit state machine with numbered states (-1 = running, 0, 1, 2… = resumed after each await).

Here's what the compiler generates (simplified):

```csharp
// Compiler-generated struct
struct FetchAndProcessStateMachine : IAsyncStateMachine
{
    public int state;              // -1, 0, 1...
    public TaskAwaiter<string> t1; // saved awaiter
    public string data;            // lifted local
    public void MoveNext()         // the big switch
    {
        try
        {
            switch (state)
            {
                case 0: goto ResumeAfterFirstAwait;
                default: goto Start;
            }
            Start:
                t1 = httpClient.GetAsync(url).GetAwaiter();
                if (!t1.IsCompleted)
                {
                    state = 0;
                    _builder.Start(ref this);
                    return;
                }
            ResumeAfterFirstAwait:
                data = t1.GetResult(); // throws if faulted
                state = -2; // terminal
                // Process(data)...
            break;
        }
        catch (Exception ex)
        {
            state = -2;
            _builder.SetException(ex);
            return;
        }
        _builder.SetResult();
    }
}
```

Key mechanics:
- Locals are lifted into struct fields so they survive across awaits.
- The TaskAwaiter is stored in a field so `GetResult()` can be called on resume — this is where exceptions from the awaited task get re-thrown.
- `_builder.Start(ref this)` queues the continuation onto whatever scheduler the awaiter provides (usually the current SynchronizationContext or ThreadPool).
- No thread is blocked. The calling thread returns immediately after the first incomplete await.

## Minimal Example

```csharp
// This allocates a state machine struct + boxed closure
async Task Example()
{
    var x = 42;
    await SomeTask();
    Console.WriteLine(x); // x is lifted into a field
}

// This does NOT lift 'x' — no capture needed
async Task Example2()
{
    var x = 42;
    Console.WriteLine(x);
    await SomeTask();
}
```

## Why This Matters

Understanding this explains several "gotchas" that trip up even experienced .NET developers:

1. **Closure capture cost**: Variables used after an await are lifted into a struct on the heap (the state machine is boxed when captured by a lambda). This means every async method that captures locals allocates — even if the awaited task completes synchronously.

2. **Synchronous completion optimization**: When `IsCompleted` is true, the compiler-generated code skips the continuation entirely and falls through inline. This is why `Task.FromResult()` is cheap in hot paths — no state machine transition occurs.

3. **Exception propagation**: Exceptions from awaited tasks don't bubble up naturally — they're caught by `GetResult()` and fed into `_builder.SetException()`, which wraps them in the returned Task. This is why await unwraps `AggregateException` while `.Result` does not.

4. **ConfigureAwait(false)** works by swapping the awaiter type from `TaskAwaiter` to `ConfiguredTaskAwaitable.ConfiguredTaskAwaiter`, which changes the continuation's context-capture behavior. The state machine shape is identical — only the resume location differs.

## Failure Modes

- **Heap allocation per async call**: Every variable captured across an await boundary becomes a field in the boxed state machine struct, creating GC pressure in hot paths.
- **SynchronizationContext deadlocks**: Calling `.Result` or `.Wait()` on an async task from a context with a single thread (like UI or ASP.NET classic) can deadlock if the continuation tries to resume on that same context.
- **Exception wrapping**: Unhandled exceptions in async void methods crash the process — they can't be caught by the caller since there's no Task to observe.

## Sharp Takeaway

async doesn't suspend threads — it compiles your method into a struct-based state machine that chains continuations, and every variable used across an await boundary becomes heap-allocated state.

## Rabbit Holes

Explore `ValueTask<T>` and how it avoids allocating a Task entirely for synchronous completions — the state machine pattern extends there too, but with `INotifyCompletion` vs `ICriticalNotifyCompletion` tradeoffs that affect exception safety guarantees.

<MiniQuiz
  question="What happens to a local variable used after an await in an async method?"
  :options="['It stays on the stack', 'It is lifted into a field of the state machine struct', 'It is stored in a closure dictionary', 'It is passed as a parameter to the continuation']"
  :answer="1"
  explanation="Variables used after an await are lifted into fields of the compiler-generated state machine struct so they survive across suspension points. When captured by a lambda, this struct is boxed onto the heap."
/>

</TopicLayout>
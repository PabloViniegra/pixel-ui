Use for brief feedback about something that just happened and needs no decision: "Saved", "Link copied", "Deploy failed".

- Mount one `<Toaster />` near the app root, then call `toast()`, `toast.success()`, `toast.warning()` or `toast.error()` from anywhere.
- Information that must stay visible or belongs to a part of the page: `Alert`. A required decision: `AlertDialog`. Field validation errors: `Field error`.
- Keep titles to a few words. Use `action` for undo or retry; a toast with an action stays until dismissed.
- Reuse an `id` to update a toast in place (loading, then success) instead of stacking new ones.
- Never put the only copy of important information in a toast.

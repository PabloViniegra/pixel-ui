Use for a message that belongs to a place in the page and should stay there: a form-level error, a plan limit, a deprecation notice.

- Feedback about an action the user just took that can disappear: use `toast`. A decision that must block the page: use `AlertDialog`. A one-word state: use `Badge`.
- Pick `tone` by meaning. `warning` and `danger` are announced immediately (`role="alert"`), so do not use them for decoration or render them on every page load without cause.
- Offer the fix in `action` ("Retry", "Upgrade") and pass `onDismiss` only when the message is safe to lose.

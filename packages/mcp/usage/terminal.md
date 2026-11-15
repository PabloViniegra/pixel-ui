Use to show streaming or historical log output: builds, deploys, job runs.

- Set `streaming` while output is still arriving and pass `maxLines` for long streams to bound the DOM.
- Give each line a stable `id` and a `level`; pass `time` as an already formatted string so server and client match.
- It is read-only: not a shell or a code editor. Static code samples belong in a `<pre>`.
- Put the run state in `status` (for example a `Badge`) and a `placeholder` for the empty state.

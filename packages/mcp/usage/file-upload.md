Use for choosing files by drag and drop or the system picker.

- It selects and validates files; it does not upload them. Send the `File[]` from `onChange` yourself and show transfer progress with `Progress`.
- Declare limits with `accept`, `maxSize` (bytes) and `maxFiles`, and say them in `hint` so users know before they try.
- Refused files are listed automatically; use `onReject` or `rejectionMessage` to customise the feedback.
- Set `multiple` to accept more than one file.
- In non-English UIs, set `label`, `listLabel` and `removeLabel`, a function that builds each remove button's name from the file name (``(name) => `Quitar ${name}` ``).

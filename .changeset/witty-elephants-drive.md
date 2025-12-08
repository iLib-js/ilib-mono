---
"ilib-lint": patch
---

Update the XliffParser and XliffSerializer processes to correctly pass the sourceLocale value. Otherwise, the webOSXliff is passed as en-US, which causes an issue.
To run the test suite, first start the server:

```bash
# This should spin up the server on port 5173.
npm run dev
```

and then run Cypress:

```bash
npm run cy:run -- --env STUDENT_SUBMISSION_URL="http://localhost:5173"
```

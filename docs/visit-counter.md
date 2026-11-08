# Website visit counter

The footer reads a shared visit total from an AWS Lambda Function URL. The total and short-lived deduplication records live in DynamoDB, rather than a visitor's browser.

## Storage and counting

- AWS region: `ap-southeast-1` (Singapore).
- DynamoDB table: `bettertagaytay-visits`.
- Lambda: `bettertagaytay-visit-counter`, using Node.js 24 on ARM64.
- The `total` item stores the cumulative `visits` number.
- A `visit#<random UUID>` item prevents retries and refreshes from incrementing the same visit twice. A DynamoDB transaction creates that item and increments the total atomically.
- Session items receive an `expiresAt` TTL 24 hours after recording. DynamoDB removes expired items asynchronously. The total does not expire.
- The browser keeps its random ID in `sessionStorage` for a fixed 30-minute window. Refreshing within that window reuses the ID. Navigation within the app never increments the counter again.
- Development and loopback previews use GET only, so local QA does not increase the public count.
- The table contains no IP addresses, names, location, user-agent strings, or browsing history. Lambda logs storage failures without request headers or session IDs; logs are retained for seven days.

This measures approximate visits, not unique people or historical traffic. A new tab or a return after the session window may count again. Storage restrictions can reduce deduplication across refreshes. An open anonymous counter is not fraud-resistant analytics; origin checks and concurrency limits do not authenticate visitors or stop a determined bot.

## Configuration

`public/site-config.json` holds the public endpoint. It contains no credentials. `VITE_VISIT_COUNTER_URL` optionally overrides the endpoint when building another environment. The component displays loading, the actual total, or an unavailable state. It does not substitute an invented count after a failure.

GET `/` reads the total. POST `/` accepts `{ "sessionId": "<UUID v4>" }` from the production origins in Terraform. GET is public so previews can display the same total. Both operations omit cookies. The frontend also omits the referrer.

## Infrastructure and updates

All resources are defined in `terraform/visits/main.tf`: the table, TTL, point-in-time recovery, Lambda, its scoped IAM role and policy, Function URL, and log group. The function uses the AWS SDK supplied by the Lambda Node.js runtime, so the deployment archive needs no dependency installation.

Use the existing `arloubeloria` CLI profile:

```sh
npm test
AWS_PROFILE=arloubeloria terraform -chdir=terraform/visits init
AWS_PROFILE=arloubeloria terraform -chdir=terraform/visits plan -out=counter.tfplan
AWS_PROFILE=arloubeloria terraform -chdir=terraform/visits apply counter.tfplan
terraform -chdir=terraform/visits output -raw endpoint
npm run build
```

Keep `public/site-config.json` aligned with the Terraform output when replacing the service. The `.terraform.lock.hcl` file is tracked for repeatable provider selection. Terraform state, plans, and the generated ZIP are ignored. Preserve the local Terraform state securely or migrate it to a managed backend before handing infrastructure maintenance to another machine. Do not initialise a separate empty state and apply it against the existing named resources.

The service was provisioned during this audit. The website itself still uses the existing manual Amplify deployment process. Deploy the rebuilt website separately to expose the footer counter publicly. No Git commit, push, or frontend deployment was performed by this audit.

## Verification

`npm test` exercises request validation, rejected origins, failure responses, counting semantics, and the mobile table conversion regression. A live integration check also recorded two synthetic sessions and sent five concurrent duplicates. The total increased by exactly two. The two test records and their increments were then removed in a transaction, leaving the public count at zero.

[AWS Function URL access model](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) and [Terraform Function URL resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url) describe the public endpoint permissions and CORS settings.

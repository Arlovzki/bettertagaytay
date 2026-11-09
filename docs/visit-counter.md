# Website visit counter

BetterTagaytay and the Transparency Portal each show a separate visit total in their footer. Both use the same AWS Lambda Function URL and DynamoDB table.

## Storage and counting

- AWS region: `ap-southeast-1` (Singapore).
- DynamoDB table: `bettertagaytay-visits`.
- Lambda: `bettertagaytay-visit-counter`, using Node.js 24 on ARM64.
- The `total` item stores the main site's cumulative visits. `total#transparency` stores the portal's cumulative visits and starts counting when enabled.
- The main site uses `visit#<random UUID>` to prevent retries and refreshes from counting twice. The portal uses `visit#transparency#<random UUID>`. A DynamoDB transaction creates the session item and increments the corresponding total atomically.
- Session items receive an `expiresAt` TTL 24 hours after recording. DynamoDB removes expired items asynchronously. The total does not expire.
- The browser keeps its random ID in `sessionStorage` for a fixed 30-minute window. Refreshing within that window reuses the ID. Navigation within the app never increments the counter again.
- Development and loopback previews use GET only, so local QA does not increase the public count.
- The table contains no IP addresses, names, location, user-agent strings, or browsing history. Lambda logs storage failures without request headers or session IDs; logs are retained for seven days.

This measures approximate visits, not unique people or historical traffic. A new tab or a return after the session window may count again. Storage restrictions can reduce deduplication across refreshes. An open anonymous counter is not fraud-resistant analytics; origin checks and concurrency limits do not authenticate visitors or stop a determined bot.

## Configuration

`public/site-config.json` holds the main site's public endpoint, with an optional `VITE_VISIT_COUNTER_URL` override. `apps/transparency/portal.config.ts` sets `visitCounterUrl` for the portal. Neither setting contains credentials. Both sites display loading, the actual total, or an unavailable state.

GET `/` reads the main total; GET `/transparency` reads the portal total. POST accepts `{ "sessionId": "<UUID v4>" }` and counts the session only if the request origin matches that route's production origins in Terraform. GET is public so previews can display the totals. The frontend omits cookies and referrers.

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
npm run build:transparency
```

Keep both endpoint settings aligned with the Terraform output when replacing the service. The `.terraform.lock.hcl` file is tracked for repeatable provider selection. Terraform state, plans, and the generated ZIP are ignored. Preserve the local Terraform state securely or migrate it to a managed backend before handing infrastructure maintenance to another machine. Do not initialise a separate empty state and apply it against the existing named resources.

The sites use the existing manual Amplify deployment process. Deploy the Lambda update before releasing a frontend that uses a new counter route.

## Verification

`npm test` exercises request validation, failure responses, separate totals, per-site origin restrictions, and deduplication across concurrent requests.

[AWS Function URL access model](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) and [Terraform Function URL resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url) describe the public endpoint permissions and CORS settings.

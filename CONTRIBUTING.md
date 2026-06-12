Branching model
---------------

This repository uses the following workflow:

- `main` — protected: only merged via pull requests (no direct commits/pushes).
- `develop` — integration branch where feature branches are merged into. Developers push feature branches and open PRs into `develop`.
- `feature/*` — short-lived branches created from `develop` for each new feature or bugfix. Merge back into `develop` via PR.

Creating branches
-----------------

Create a feature branch from `develop`:

```
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

Work on the feature, then push and open a PR to `develop`:

```
git add .
git commit -m "feat: add my feature"
git push -u origin feature/my-feature
```

Open a Pull Request on GitHub targeting `develop`. After review and CI passing, merge into `develop`.

When `develop` is stable and release-ready, open a PR from `develop` into `main` for final review and merge.

Protecting `main`
-----------------

To prevent direct commits to `main`, enable branch protection in GitHub settings (Repository → Settings → Branches → Add rule):

- Protect the `main` branch
- Require pull request reviews before merging
- Require status checks to pass before merging
- Restrict who can push to matching branches (optional)

You can also configure branch protection via the GitHub API (replace `TOKEN` and `OWNER/REPO`):

```
curl -X PUT -H "Authorization: token TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/branches/main/protection \
  -d '{
    "required_status_checks": null,
    "enforce_admins": true,
    "required_pull_request_reviews": { "required_approving_review_count": 1 },
    "restrictions": null
  }'
```

Local safety hook
-----------------

To help prevent accidental pushes to `main` locally, this repo includes a sample `pre-push` hook (in `.git/hooks/`) that rejects pushes to `main`. This hook is not enforced on the remote; use branch protection on GitHub for enforcement.

Pull request template
---------------------

Use the provided PR template when opening pull requests to document the change, testing steps, and reviewers.

Questions
---------
If you'd like, I can also:

- Set up a GitHub Action to automate PR checks.
- Show the exact API payload to enforce more strict rules.

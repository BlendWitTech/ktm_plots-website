# Contributing to KTM Plots Theme

This repo is maintained by **Blendwit Tech**. Contributions are by invitation only from the KTM Plots project team.

---

## Getting Started

1. Make sure you have access to this GitHub repo (contact [hello@blendwit.com](mailto:hello@blendwit.com) if not)
2. Follow [SETUP.md](SETUP.md) — Part 1 to get the theme running locally
3. Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) before writing any code

---

## Contribution Rules

- All changes must be made via **Pull Requests** — never push directly to `main`
- Every PR must have a passing Vercel preview deployment before it can be reviewed
- Every PR must be reviewed and approved by a Blendwit Tech maintainer before merging
- Do not commit `.env` files, secrets, or credentials
- Do not commit files in `media/` — uploaded media must not be in git

---

## Git Workflow

```
main          ← production (Blendwit Tech merges here after review)
  └── feature/your-feature    ← your work
  └── fix/bug-description
```

```bash
# Always start from the latest main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/short-description

# Work and commit using conventional commits
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): update filter layout"

# Push and open a PR to main
git push origin feature/short-description
# Open PR on GitHub: feature/short-description → main
```

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

| Type | When to use |
|---|---|
| `feat` | New page, section, or feature |
| `fix` | Bug fix |
| `chore` | Config, dependencies, build |
| `docs` | Documentation changes only |
| `refactor` | Restructure without behaviour change |
| `style` | CSS / formatting — no logic change |

**Examples:**
```
feat(plots): add map view to plot detail page
fix(hero): correct mobile filter overflow
chore(deps): update next to 16.2.0
docs(setup): add revalidation setup steps
```

---

## PR Checklist

Before opening a PR, confirm:

- [ ] `npm run build` passes locally without errors
- [ ] No TypeScript errors (`npm run lint` passes)
- [ ] Vercel preview URL loads correctly with content from the CMS
- [ ] No hardcoded content that should come from the CMS
- [ ] Mobile layout tested at 375px and 768px
- [ ] PR title follows the commit convention format
- [ ] PR description explains what changed and why

---

## Reporting Issues

Open a GitHub issue in this repo, or email [hello@blendwit.com](mailto:hello@blendwit.com).

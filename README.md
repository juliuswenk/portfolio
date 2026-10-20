# Julius Wenk — Portfolio

The website lives in `site/`. No build step or package installation is required.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000 in your browser. The 3D renderer loads Three.js from a CDN, and embedded Vimeo films require internet access.

## Check the website

With Node.js installed, run:

```sh
node check.cjs
```

The seven project-description Markdown files in `Projekte/` are retained because the checks compare them with the website copy. Only `site/` needs to be served or deployed.

## What is backed up

Git tracks the website code, its currently referenced images, videos and animated model, the checks, their copy sources, this README, and `.gitignore`.

Original project media, design source files, preview screenshots, local notes and settings, and 11 unused web assets are excluded by `.gitignore`. They remain on the computer and need a separate backup if you want to preserve them. No files were deleted to prepare this repository.

The unused asset exclusions reflect the current website. If a later change uses one of those files, remove its entry from `.gitignore` before committing.

## GitHub backup

The private backup repository is [juliuswenk/portfolio-website](https://github.com/juliuswenk/portfolio-website).

To restore it on another computer, authenticate with GitHub and run:

```sh
gh repo clone juliuswenk/portfolio-website
```

## Save future changes

From the repository root:

```sh
git status --short
git add .
git diff --cached --stat
git commit -m "Update portfolio"
git push
```

Review the staged file list before committing. Newly added files at the repository root are excluded by default; add an exception to `.gitignore` when one should be backed up. Changes become an off-computer backup only after a successful push.

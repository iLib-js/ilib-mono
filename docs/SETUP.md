## Setup

### Prerequisites

This project is developed using Node.js, nvm and pnpm.
Make sure you've got them installed in correct versions before continuing.

Versions used for development:

- Node.js: version specified in `.nvmrc` file
- pnpm: version specified in `package.json` file

You can find installation instructions at:

- [nodejs.org](https://nodejs.org/)
- [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- [pnpm.io/](https://pnpm.io/)

### Repository clone

Clone the repository to your local machine with HTTPS:

```bash
git clone https://github.com/iLib-js/ilib-mono.git
```

or with SSH:

```bash
git clone git@github.com:iLib-js/ilib-mono.git
````

Navigate to the project root directory:

```bash
cd ilib-mono
```

Every command from now on should be run in the root directory of the project, unless stated otherwise.

### Installation

Once Node.js, nvm and pnpm are installed, you can continue with the following steps.

#### 1. Installing project specific Node.js version

Install and use Node.js version specified in `ilib-mono/.nvmrc` file.
Run:

```bash
nvm use
```

Optional: You can add automated `nvm use` to shell profile. See
guide [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh).

#### 2. Enabling pnpm

Since v16.13, Node.js is shipping [Corepack](https://nodejs.org/api/corepack.html) for managing package managers, so you
do not need to install pnpm separately.
However, this is an experimental feature, so you need to enable it by running:

```bash
corepack enable pnpm
```

Optional: `pnpm` might be hard to type, so you may use a shorter alias like `pn` instead. See
guide [here](https://pnpm.io/installation#using-a-shorter-alias).

#### 3. Installing project dependencies

The final step is to install the project dependencies. Run:

```bash
pnpm install
```

You do NOT need to run `pnpm install` from package directories, as the monorepo is set up to handle dependencies for all
packages automatically.

#### 4. Install Git Hooks

The project comes with a set of Git Hooks that are automatically installed as part of the post-installation process.
You do not need to run a separate command for this. The hooks are set up when you run:

```bash
pnpm install
```

In case you need to install Git Hooks manually, you can run:

```bash
pnpm postinstall
```

Or run the setup script directly:

```bash
./scripts/setup-git-skip-worktree.sh
```

#### 5. Auto-Modified Files Setup

Some files in this repository get automatically modified by e2e tests and sample projects. These files are automatically set to `skip-worktree` to prevent accidental commits. The setup happens automatically during `pnpm install`.

**Files with skip-worktree:**
- `packages/ilib-loctool-android-layout/samples/android/res/layout/t1.xml`
- `packages/ilib-loctool-android-resource/samples/android/res/layout/t1.xml`

**To commit changes to these files:**
```bash
git update-index --no-skip-worktree <file>
git add <file>
git commit -m "Update <file>"
git update-index --skip-worktree <file>
```

**To check which files are being skipped:**
```bash
git ls-files -v | grep "^S"
```

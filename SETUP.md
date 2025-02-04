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

Optional: You can add automated `nvm use` to shell profile. See guide [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh).

#### 2. Enabling pnpm
Since v16.13, Node.js is shipping [Corepack](https://nodejs.org/api/corepack.html) for managing package managers, so you do not need to install pnpm separately.
However, this is an experimental feature, so you need to enable it by running:
```bash
corepack enable pnpm
```

Optional: `pnpm` might be hard to type, so you may use a shorter alias like `pn` instead. See guide [here](https://pnpm.io/installation#using-a-shorter-alias).

#### 3. Installing project dependencies
The final step is to install the project dependencies. Run:
```bash
pnpm install
```
You do NOT need to run `pnpm install` from package directories, as the monorepo is set up to handle dependencies for all packages.

#### 4. Install Git hooks

To install the standard Git hooks for the project, run:

```bash
pnpm postinstall
```


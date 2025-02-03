# ilib-mono

<!-- Jest Coverage Comment:Begin -->${dupa}<!-- Jest Coverage Comment:End -->

This repository is a monorepo for the [iLib-js project](https://github.com/iLib-js).
It aims to contain all the packages that are part of the iLib-js, even though every package is published to npm as a separate package.

The monorepo is managed using pnpm workspaces and Turborepo.

All packages are placed in the `packages/` directory.
Each package has its own `README.md` and `package.json`, which are located in the package root directory.


## Table of Contents
- [Project Status](#project-status)
- [Project Structure](#project-structure)
- [Targeted Node.js Versions](#targeted-nodejs-versions)
- [Usage](#usage)
- [Setup](#setup)
- [Contributing](#contributing)
- [Publishing](#publishing)
- [License](#license)


## Project Status
This project is currently in development.

iLib-js packages are now being migrated to this monorepo.
All the packages that are moved to the monorepo are marked as 'archived' in their original GitHub repositories.


## Project Structure
The project is structured as follows:
- `packages/` - Contains all the packages that are part of the monorepo. Each package is a separate directory containing its own `package.json` file. Each package is published to npm as a separate package.
- `package.json` - Contains the root project configuration.
- `pnpm-workspace.yaml` - Contains the configuration for pnpm workspaces.
- `turbo.json` - Contains the configuration for Turborepo.
- `pnpm-lock.yaml` - Contains the lockfile for pnpm.


## Targeted Node.js Versions
`ilib-mono` aim to target Node.js versions >=12.0.0 when building packages for npm registry.


## Usage
To use packages in this monorepo, import them as any other npm package.
For example, to use the `ilib-common` package from within any other package in the `/packages` directory, import it like this:
```javascript
import { JSUtils, Utils, Path } from 'ilib-common';
```


## Setup
For detailed setup instructions to get the project running on local machine, please refer to the [SETUP.md](./SETUP.md) file.


## Contributing
Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute to this project.


## Publishing
For publishing instructions, please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.


## License
This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.

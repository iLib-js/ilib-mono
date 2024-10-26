# ilib-mono

Monorepo for containing the plethora of ilib tools and plugins.

## Setting up Circleci for Your Package

To set up Circleci for your package, you need to do the following:

1. Edit the .circleci/config.yml file to include your package in the
   list of packages to build and test. Modify the list of packages in
   the workflows.setup-workflow.jobs[0].modules section to include your
   package. This will cause Circleci to build and test only your package
   whenever a new commit is pushed to the repository in your package.

2. Include the .circleci/config.yml from the original repo in your
   package. This needs to be modified a little from the original to
   differentiate between the workflows and tests for each package. The
   config.yml files for all packages are merged together to create the
   final config.yml file for Circleci, so if your workflow is named the
   same thing as another package's workflow, it will overwrite the other
   package's workflow. Additionally, we have to cd to the package directory
   before running the tests. This is because the original config.yml file
   assumes that the package is in the root of the repository. Of course,
   this is not the case for a monorepo!

   Example original .circleci/config.yml file:

   ```yaml
version: 2.1
jobs:
  test:
    parameters:
        docker_image:
          type: string
          default: cimg/node:current-browsers
    docker:
      - image: << parameters.docker_image >>
    steps:
      - checkout
      - run:
          name: Setup
          command: |
            rm -rf node_modules package-lock.json
            npm install
      - run:
          name: Running all unit tests
          command: |
            node -v
            npm -v
            npm run test --detectOpenHandles

workflows:
  version: 2
  test-all-node-versions:
    jobs:
      - test:
          docker_image: cimg/node:16.19
      - test:
          docker_image: cimg/node:18.9
      - test:
          docker_image: cimg/node:20.9
      - test
   ```

   The convention we will follow is to add the package name to the test and
   to the workflow names. Here is how it would be modified for a package named
   `example-package`:

   ```yaml
version: 2.1
jobs:
  test-example-package:
    parameters:
        docker_image:
          type: string
          default: cimg/node:current-browsers
    docker:
      - image: << parameters.docker_image >>
    steps:
      - checkout
      - run:
          name: Setup
          command: |
            cd packages/example-package
            rm -rf node_modules package-lock.json
            npm install
      - run:
          name: Running all unit tests
          command: |
            cd packages/example-package
            node -v
            npm -v
            npm run test --detectOpenHandles

workflows:
  version: 2
  test-example-package-all-node-versions:
    jobs:
      - test-example-package:
          docker_image: cimg/node:16.19
      - test-example-package:
          docker_image: cimg/node:18.9
      - test-example-package:
          docker_image: cimg/node:20.9
      - test-example-package
   ```

## License

ilib-mono and all of its subpackages are licensed under the Apache 2.0 license. See
the [LICENSE](LICENSE) file for more details.


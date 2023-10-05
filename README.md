# Generate Service Worker

This utility package designed to simplify the generation of service workers for Next.js applications. This package automates the process of gathering a list of static files from a Next.js app's build directory and injects it into the service worker template of the project, along with `BUILD_ID` and `STATIC_FILES` constants.

## Installation

To install this package, you can use npm or yarn:

```bash
npm install @omermecitoglu/generate-service-worker
```

or

```bash
yarn add @omermecitoglu/generate-service-worker
```

## Usage

To use this package, you can run it from the command line with the following command:

```bash
generate-service-worker --entry <entry-file>
```

Replace `<entry-file>` with the path to your entry file.

## Configuration

You can configure this package by adding options to the command line:

- `--entry <entry-file>`: Specify the entry file for your Next.js app.
- Other options can be added here...

## Examples

Here's an example of how to generate a service worker for a Next.js app:

```bash
generate-service-worker --entry src/service-worker.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

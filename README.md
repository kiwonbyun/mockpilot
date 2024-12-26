# MockPilot

MockPilot is a developer-friendly API mocking tool built on top of [MSW (Mock Service Worker)](https://mswjs.io/). It provides an intuitive UI for creating, managing, and persisting API mocks during development.

## Features

- 🎯 Easy-to-use UI for API mocking
- 💾 Automatic persistence of mocks across page reloads
- ⏱️ Configurable response delays
- 🔄 Support for multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
- 🎨 JSON editor with syntax highlighting
- 🔌 Pass-through mode for selective mocking
- 📝 Dynamic response templating with URL parameters

## Demo

Check out the live demo at: [MockPilot Demo](http://mock-pilot-demo.s3-website.ap-northeast-2.amazonaws.com)

## Installation

```bash
npm install -D mockpilot msw@^2.0.0
yarn add -D mockpilot msw@^2.0.0
pnpm add -D mockpilot msw@^2.0.0
```

## Quick Start

1. Setup MSW in your project:

```bash
npx msw init <PUBLIC_DIR> --save
```

2. Wrap your app with MockPilotTools:

```javascript
import { MockPilotTools } from "mockpilot";

function App() {
  return (
    <MockPilotTools>
      <YourApp />
    </MockPilotTools>
  );
}
```

If you're using Next.js, add the following configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // next server build => ignore msw/browser
      if (Array.isArray(config.resolve.alias)) {
        // in Next the type is always object, so this branch isn't necessary. But to keep TS happy, avoid @ts-ignore and prevent possible future breaking changes it's good to have it
        config.resolve.alias.push({ name: "msw/browser", alias: false });
      } else {
        config.resolve.alias["msw/browser"] = false;
      }
    } else {
      // browser => ignore msw/node
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/node", alias: false });
      } else {
        config.resolve.alias["msw/node"] = false;
      }
    }
    return config;
  },
};

module.exports = nextConfig;
```

You might encounter SSR-related issues. You can find solutions in this GitHub issue.

3. Click the MockPilot icon in development mode to open the mocking interface
4. Configure your mock APIs through the UI

## Mock Configuration

- **Method**: Select HTTP method (GET, POST, PUT, DELETE, PATCH)
- **Endpoint URL**: Enter the API endpoint to mock
- **Response Delay**: Simulate network latency (0-5000ms)
- **Response Status**: Choose between Pass Through, Success (200), or Error (400)
- **Response Body**: Define the mock response in JSON format

## Dynamic Response Templates

You can use URL parameters in your response body using the `{{parameter}}` syntax:

```json
{
  "userId": "{{id}}",
  "query": "{{search}}"
}
```

This will be replaced with actual values from URL parameters or query strings.

## Development Mode Only

MockPilot is automatically disabled in production builds, making it safe to keep in your codebase.

## Requirements

- React 18 or higher
- MSW v2
- Modern browser with Service Worker support

## License

ISC

## Contributing

Issues and pull requests are welcome! Please feel free to contribute to this project.

## Author

kiwonbyun

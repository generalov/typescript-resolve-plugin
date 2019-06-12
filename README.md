# typescript-resolve-plugin

[![NPM Version][npm-image]][npm-url]

Use custom module resolvers with TypeScript language server.

## Configuration

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-resolve-plugin",
        "resolver": "<path>/resolver.js",
        "options": {}
      }
    ]
  }
}
```

## Resolver

```js
module.exports = function createResolver({ options, cwd }) {
  return {
    resolve(moduleName, containingFile) {
      const resolved = moduleName // rewrite moduleName
      return resolved
    },
  }
}
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/typescript-resolve-plugin.svg
[npm-url]: https://www.npmjs.com/package/typescript-resolve-plugin

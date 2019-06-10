# typescript-resolve-plugin

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
    }
  }
}
```

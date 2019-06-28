import * as ts_module from 'typescript/lib/tsserverlibrary'
import { Resolver } from './resolver'

const isTsResolvePatchMarker = Symbol('__isTsResolvePatchMarker__')

export function patchTypescriptIfNeeded(ts: typeof ts_module, resolver: Resolver) {
  if (!(ts as any)[isTsResolvePatchMarker]) {
    const defaultModuleNameResolver = ts.resolveModuleName
    ts.resolveModuleName = (moduleName, containingFile, ...args) => {
      const resolvedName = resolver.resolve(moduleName, containingFile)
      return defaultModuleNameResolver.call(ts, resolvedName, containingFile, ...args)
    }
    ;(ts as any)[isTsResolvePatchMarker] = true
  }
}

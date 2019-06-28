import { Logger } from './logger'

export interface Resolver {
  resolve(moduleName: string, containingFile: string): string
}

const idResolver: Resolver = {
  resolve(moduleName) {
    return moduleName
  },
}

export class ResolverManager {
  private static readonly defaultResolver = idResolver
  private resolver: Resolver = ResolverManager.defaultResolver

  constructor(private readonly logger: Logger, config?: object) {
    if (config) {
      this.configure(config)
    }
  }

  resolve(moduleName: string, containingFile: string) {
    return this.resolver.resolve(moduleName, containingFile)
  }

  configure(config: any) {
    this.logger.info({ message: 'reload resolver', config })
    try {
      const createResolver = require(config.resolver)
      this.resolver = createResolver(config)
    } catch (error) {
      this.resolver = ResolverManager.defaultResolver
      this.logger.info({ message: 'reloadResolver failed', error, config })
    }
  }
}

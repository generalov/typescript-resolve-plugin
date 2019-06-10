import { Logger } from './logger'

export type Resolver = {
  resolve(moduleName: string, containingFile: string): string
}

export class ResolverManager {
  private resolver?: Resolver

  constructor(private readonly logger: Logger) {}

  resolve(moduleName: string, containingFile: string) {
    return this.resolver ? this.resolver.resolve(moduleName, containingFile) : moduleName
  }

  reloadResolver(config: any) {
    this.logger.info({ message: 'reload resolver', config })
    this.resolver = undefined
    try {
      const createResolver = require(config.resolver)
      this.resolver = createResolver(config)
    } catch (error) {
      this.logger.info({ message: 'reloadResolver failed', error, config })
    }
  }
}

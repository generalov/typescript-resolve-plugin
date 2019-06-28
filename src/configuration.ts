import * as path from 'path'
import * as ts_module from 'typescript/lib/tsserverlibrary'

import { Logger } from './logger'

type Configuration = {
  resolver?: string
  cwd?: string
}

export class ConfigurationManager {
  private _configUpdatedListener = () => {}
  private _configuration: Configuration = {}
  private _workingDirectory?: string

  constructor(private readonly logger: Logger) {}

  public get config(): Configuration {
    return this._configuration
  }

  public setProject(project: ts_module.server.Project) {
    this._workingDirectory = project.getCurrentDirectory()
  }

  public updateFromPluginConfig(config: Configuration) {
    if (!config.resolver) {
      return
    }
    const cwd = config.cwd || this._workingDirectory
    const resolver =
      config.resolver && !path.isAbsolute(config.resolver) && cwd ? path.join(cwd, config.resolver) : config.resolver

    this._configuration = {
      ...config,
      ...{ resolver, cwd },
    }

    this.logger.info({ message: 'Configuration updated', config: this.config })

    this._configUpdatedListener()
  }

  public onUpdatedConfig(listener: () => void) {
    this._configUpdatedListener = listener
  }
}

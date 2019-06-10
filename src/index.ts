import * as ts_module from 'typescript/lib/tsserverlibrary'

import { ConfigurationManager } from './config'
import { Logger } from './logger'
import { ResolvePlugin } from './plugin'
import { ResolverManager } from './resolver'

const logger: Logger = new Logger()
const configManager = new ConfigurationManager(logger)
const resolver = new ResolverManager(logger)

export = function init({ typescript }: { typescript: typeof ts_module }) {
  return {
    create(info: ts_module.server.PluginCreateInfo) {
      const plugin = new ResolvePlugin(typescript, logger, info.project, resolver)

      logger.setLogger(info.project.projectService.logger)
      configManager.onUpdatedConfig(() => {
        resolver.reloadResolver(configManager.config)
        plugin.refreshFiles()
      })
      configManager.setProject(info.project)
      configManager.updateFromPluginConfig(info.config)

      return plugin.decorate(info.languageService)
    },

    onConfigurationChanged(config: any) {
      configManager.updateFromPluginConfig(config)
    }
  }
}

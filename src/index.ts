import * as ts_module from 'typescript/lib/tsserverlibrary'

import { ConfigurationManager } from './configuration'
import { Logger } from './logger'
import { ResolverManager } from './resolver'
import { patchTypescriptIfNeeded } from './patch'

const logger: Logger = new Logger()
const configManager = new ConfigurationManager(logger)
const resolver = new ResolverManager(logger)

function refresh(project: ts_module.server.Project) {
  logger.info('refresh project')
  const anyProject = project as any
  anyProject.setInternalCompilerOptionsForEmittingJsFiles()
  anyProject.cachedUnresolvedImportsPerFile.clear()
  anyProject.lastCachedUnresolvedImportsList = undefined
  anyProject.resolutionCache.clear()
  anyProject.markAsDirty()
  anyProject.onChangedAutomaticTypeDirectiveNames()
  ;(project.projectService as any).delayUpdateProjectGraphs([project])
  ;(project.projectService as any).filenameToScriptInfo.forEach((info: any) => {
    info.delayReloadNonMixedContentFile()
  })
}

export = function init({ typescript }: { typescript: typeof ts_module }) {
  patchTypescriptIfNeeded(typescript, resolver)
  return {
    create(info: ts_module.server.PluginCreateInfo) {
      logger.setLogger(info.project.projectService.logger)
      configManager.onUpdatedConfig(() => {
        resolver.configure(configManager.config)
        refresh(info.project)
      })
      configManager.setProject(info.project)
      configManager.updateFromPluginConfig(info.config)

      return info.languageService
    },

    onConfigurationChanged(config: any) {
      configManager.updateFromPluginConfig(config)
    },
  }
}

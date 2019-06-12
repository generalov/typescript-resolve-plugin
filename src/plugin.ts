import * as ts_module from 'typescript/lib/tsserverlibrary'

import { Logger } from './logger'
import { Resolver } from './resolver'

const isTsLintLanguageServiceMarker = Symbol('__isTsResolveLanguageServiceMarker__')

export class ResolvePlugin {
  constructor(
    private readonly ts: typeof ts_module,
    private readonly logger: Logger,
    private readonly project: ts_module.server.Project,
    private readonly resolver: Resolver,
  ) {
    this.logger.info('loaded')
  }

  decorate(languageService: ts_module.LanguageService) {
    if (!(languageService as any)[isTsLintLanguageServiceMarker]) {
      this.patchTypescript()
      this.patchProject()
      ;(languageService as any)[isTsLintLanguageServiceMarker] = true
    }
    this.refreshFiles()
    return languageService
  }

  private resolve(moduleName: string, containingFile: string) {
    this.logger.info({ action: 'resolve', moduleName, containingFile })
    return this.resolver.resolve(moduleName, containingFile)
  }

  private patchTypescript() {
    const defaultNodeModuleNameResolver = this.ts.nodeModuleNameResolver.bind(this.ts)
    this.ts.nodeModuleNameResolver = (moduleName, containingFile, ...args) => {
      const resolvedName = this.resolve(moduleName, containingFile)
      return defaultNodeModuleNameResolver(resolvedName, containingFile, ...args)
    }
  }

  private patchProject() {
    const defaultModuleNamesResolver = this.project.resolveModuleNames.bind(this.project)
    this.project.resolveModuleNames = (moduleNames: string[], containingFile: string, ...args) => {
      const resolved = moduleNames.map(name => this.resolve(name, containingFile))
      return defaultModuleNamesResolver(resolved, containingFile, ...args)
    }

    const defaultResolveTypeReferenceDirectives = this.project.resolveTypeReferenceDirectives.bind(this.project)
    this.project.resolveTypeReferenceDirectives = (typeDirectiveNames: string[], containingFile: string, ...args) => {
      const resolved = typeDirectiveNames.map(name => this.resolve(name, containingFile))
      return defaultResolveTypeReferenceDirectives(resolved, containingFile, ...args)
    }
  }

  public refreshFiles() {
    ;(this.project as any).onChangedAutomaticTypeDirectiveNames()
    ;(this.project.projectService as any).delayUpdateProjectGraphs([this.project])
    ;(this.project.projectService as any).filenameToScriptInfo.forEach((info: any) => {
      info.delayReloadNonMixedContentFile()
    })
  }

  // private reloadOptions() {
  //   (this.project.projectService as any).onConfigChangedForConfiguredProject(this.project, this.ts.FileWatcherEventKind.Changed)
  // }
}

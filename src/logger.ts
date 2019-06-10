import * as ts_module from 'typescript/lib/tsserverlibrary'

import { pluginId } from './constants'

export class Logger {
  private _logger?: ts_module.server.Logger

  public setLogger(logger: ts_module.server.Logger) {
    this._logger = logger
  }

  public info(message: any) {
    this._logger && this._logger.info(`[${pluginId}] ${JSON.stringify(message)}`)
  }
}

import { inject, injectable } from 'inversify'

import { StorageService } from '../../services/storage'
import * as tokens from '../../types/tokens'
import { LocalStorageUpdate } from '../../types/commands'

import { PopupPorts } from './PopupPorts'

@injectable()
export class BackgroundStorageService extends StorageService {
  constructor(
    storage: Storage,
    private popupPorts: PopupPorts,
    @inject(tokens.WextApi) private api = chrome
  ) {
    super(storage, (key: string) => {
      const message: LocalStorageUpdate = {
        command: 'localStorageUpdate',
        key
      }
      this.api.runtime.sendMessage(message, () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const ignored = this.api.runtime.lastError
      })
      this.popupPorts.sendMessage(message)
    })
  }
}

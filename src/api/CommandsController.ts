import TelegramBot from 'node-telegram-bot-api'
import { readFileSync, writeFileSync } from 'fs'
import Downloader from './Downloader'
import Player from './Player'

import commands from '../constants/commands'

import userType from '../types/userType'
import musicType from '../types/musicType'

class CommandsController {
  #getCandidates(bot: TelegramBot, msg: TelegramBot.Message): string[] {
    const matches = msg.text?.match(/\s\w+/g)
    if (!matches) {
      bot.sendMessage(msg.chat.id, 'No usernames provided! 😕')
      return []
    }

    return matches.map(m => m.trim())
  }

  #checkUserRights(userRole: string, command: string): boolean {
    const commandInformation = commands.find(c => c.command === command)
    if (!commandInformation) return false
    return commandInformation.required_status.includes(userRole)
  }

  handleUsersCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): void {
    if (this.#checkUserRights(userRole, 'users')) {
      const users: userType[] = JSON.parse(
        readFileSync('./src/config/users.json', 'utf8')
      )
      const message = users
        .map(user => `@${user.username} <b>${user.status}</b>`)
        .join('\n')
      bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' })
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  handleAddCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): void {
    const candidates = this.#getCandidates(bot, msg)
    if (candidates.length === 0) return

    if (this.#checkUserRights(userRole, 'add')) {
      const prev = JSON.parse(readFileSync('./src/config/users.json', 'utf8'))
      const next = candidates.map(candidate => {
        return {
          username: candidate,
          status: 'user',
        }
      })

      writeFileSync(
        './src/config/users.json',
        JSON.stringify([...prev, ...next])
      )
      bot.sendMessage(
        msg.chat.id,
        `Added <b>${candidates.join(', ')}</b> to "Users" group ✅`,
        { parse_mode: 'HTML' }
      )
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  handleOpCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): void {
    const candidates = this.#getCandidates(bot, msg)
    if (candidates.length === 0) return

    if (this.#checkUserRights(userRole, 'op')) {
      const prev: userType[] = JSON.parse(
        readFileSync('./src/config/users.json', 'utf8')
      )

      const knownUsers = prev.map(user => user.username)
      const unknownCandidates: string[] = JSON.parse(
        JSON.stringify(
          candidates.filter(candidate => {
            return !knownUsers.includes(candidate)
          })
        )
      )

      if (unknownCandidates)
        unknownCandidates.forEach(candidate =>
          prev.push({
            username: candidate,
            status: 'user',
          })
        )

      const next = prev.map(user => {
        if (candidates.includes(user.username))
          return {
            username: user.username,
            status: 'admin',
          }

        return user
      })

      writeFileSync('./src/config/users.json', JSON.stringify(next))

      bot.sendMessage(
        msg.chat.id,
        `Updated <b>${candidates.join(', ')}</b> status ✅`,
        { parse_mode: 'HTML' }
      )
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  handleRemoveCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): void {
    const candidates = this.#getCandidates(bot, msg)
    if (candidates.length === 0) return

    if (this.#checkUserRights(userRole, 'remove')) {
      const prev: userType[] = JSON.parse(
        readFileSync('./src/config/users.json', 'utf8')
      )
      const next = prev.filter(user => !candidates.includes(user.username))

      writeFileSync('./src/config/users.json', JSON.stringify(next))

      bot.sendMessage(
        msg.chat.id,
        `Removed <b>${candidates.join(', ')}</b> from users list ✅`,
        { parse_mode: 'HTML' }
      )
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  async handleOrderCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): Promise<void> {
    if (!msg.text) return

    if (this.#checkUserRights(userRole, 'order')) {
      if (!msg.text.substring(0, msg.text.indexOf(' '))) {
        bot.sendMessage(msg.chat.id, 'No URL was provided! 🤨')
        return
      }

      const url = msg.text.substring(msg.text.indexOf(' ') + 1).trim()
      const musicLibrary: musicType[] = JSON.parse(
        readFileSync('./src/config/musicLibrary.json', 'utf8')
      )
      const foundMusic = musicLibrary.find(obj => obj.url === url)
      if (foundMusic) {
        await Player.addMusicToQueue(foundMusic.filename)
        bot.sendMessage(
          msg.chat.id,
          `Added <b>${foundMusic.filename}</b> to queue 💿`,
          { parse_mode: 'HTML' }
        )
        return
      }

      Downloader.downloadAudio(url)
        .then(async filename => {
          await Player.addMusicToQueue(filename)
          bot.sendMessage(msg.chat.id, `Added <b>${filename}</b> to queue 💿`, {
            parse_mode: 'HTML',
          })
        })
        .catch(e => bot.sendMessage(msg.chat.id, e))
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  async handleSkipCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): Promise<void> {
    if (this.#checkUserRights(userRole, 'skip')) {
      await Player.skipMusic()
      bot.sendMessage(msg.chat.id, 'Skipped track ⚡')
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  async handleClearCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): Promise<void> {
    if (this.#checkUserRights(userRole, 'clear')) {
      await Player.clearQueue()
      bot.sendMessage(msg.chat.id, 'Cleaned queue 😋')
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  async handleListCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): Promise<void> {
    if (this.#checkUserRights(userRole, 'clear')) {
      const queue = await Player.showQueue()
      let i = 0
      const message = queue
        .map(audio => {
          i++
          if (audio.isCurrent)
            return `<b>[${i}] ${audio.name.slice(0, audio.name.length - 4)}</b>`
          return `[${i}] ${audio.name}`
        })
        .join('\n')
      bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'HTML',
      })
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }
}

export default new CommandsController()

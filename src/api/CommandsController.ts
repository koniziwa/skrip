import TelegramBot from 'node-telegram-bot-api'
import { readFileSync, writeFileSync } from 'fs'

import commands from '../constants/commands'

import userType from '../types/userType'

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
        `Successfully added ${candidates.join(', ')} to "Users" group ✅`
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
        `Successfully updated ${candidates.join(', ')} status ✅`
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
        `Successfully removed ${candidates.join(', ')} from users list ✅`
      )
    } else bot.sendMessage(msg.chat.id, 'You have no rights to do this! 😡')
  }

  handleOrderCommand(
    bot: TelegramBot,
    msg: TelegramBot.Message,
    userRole: string
  ): void {
    if (!msg.text) return

    if (!msg.text.substring(0, msg.text.indexOf(' '))) {
      bot.sendMessage(msg.chat.id, 'No URL was provided! 🤨')
      return
    }

    const url = msg.text.substring(msg.text.indexOf(' ') + 1).trim()
  }
}

export default new CommandsController()

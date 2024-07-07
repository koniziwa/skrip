import TelegramBot from 'node-telegram-bot-api'
import { readFileSync, existsSync, mkdirSync } from 'fs'

import CommandsController from './api/CommandsController'

import TELEGRAM_BOT_TOKEN from './private/TELEGRAM_BOT_TOKEN'

import commands from './constants/commands'

import userType from './types/userType'

if (!existsSync('./collection')) {
  mkdirSync('./collection')
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

bot.setMyCommands(commands)

bot.on('polling_error', err => {
  console.log(err)
})

bot.on('text', msg => {
  const username = msg.from?.username
  if (!msg.text) return

  const users: userType[] = JSON.parse(
    readFileSync('./src/config/users.json', 'utf8')
  )

  const userRole: string =
    users.find(user => user.username === username)?.status || 'unknown'

  const commandsInMessage = msg.text.match(/^\/[a-zA-z]+/)

  if (!commandsInMessage) {
    bot.sendMessage(msg.chat.id, 'Please send me a command ')
    return
  }
  const command = commandsInMessage[0]

  switch (command) {
    case '/op':
      CommandsController.handleOpCommand(bot, msg, userRole)
      break

    case '/add':
      CommandsController.handleAddCommand(bot, msg, userRole)
      break

    case '/remove':
      CommandsController.handleRemoveCommand(bot, msg, userRole)
      break

    case '/order':
      CommandsController.handleOrderCommand(bot, msg, userRole)
      break

    default:
      bot.sendMessage(msg.chat.id, 'Invalid command! 🥱')
  }
})

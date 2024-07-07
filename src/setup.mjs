import inquirer from 'inquirer'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

if (!existsSync('./src/config')) mkdirSync('./src/config')
if (!existsSync('./src/private')) mkdirSync('./src/private')
writeFileSync('./src/config/musicLibrary.json', '[]')

const { rootUser } = await inquirer.prompt({
  type: 'input',
  name: 'rootUser',
  message: "Host's tg username (without @):",
})
writeFileSync(
  './src/config/users.json',
  `[{"username":"${rootUser}","status":"host"}]`
)

const { token } = await inquirer.prompt({
  type: 'input',
  name: 'token',
  message: 'Telegram bot secret token:',
})
writeFileSync(
  './src/private/TELEGRAM_BOT_TOKEN.ts',
  `export default '${token}'`
)

const { vlcPassword } = await inquirer.prompt({
  type: 'input',
  name: 'vlcPassword',
  message: 'Password for WEB interface of VLC:',
})
writeFileSync(
  './src/private/VLC_PASSWORD.ts',
  `export default '${vlcPassword}'`
)

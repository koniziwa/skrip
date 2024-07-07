import { existsSync, rmSync, writeFileSync } from 'fs'

if (existsSync('./collection'))
  rmSync('./collection', { recursive: true, force: true })

if (existsSync('./dist')) rmSync('./dist', { recursive: true, force: true })

writeFileSync('./src/config/musicLibrary.json', '[]')

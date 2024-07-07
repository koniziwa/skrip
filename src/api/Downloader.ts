import shell from 'shelljs'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { readFileSync, writeFileSync } from 'fs'

import musicType from '../types/musicType'

class Downloader {
  ffmpegPath = shell.which('ffmpeg')?.stdout
  filenameRegexp = /[\\\/:*?"<>|]/gi

  async downloadAudio(url: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.ffmpegPath) {
        reject('There is no ffmpeg on server! 😡')
        return
      }

      try {
        const { videoDetails } = await ytdl.getBasicInfo(url)
        const filename = videoDetails.title.replace(this.filenameRegexp, '')
        const stream = ytdl(url, {
          quality: 'highestaudio',
          filter: 'audioonly',
        })

        const musicLibrary: musicType[] = JSON.parse(
          readFileSync('./src/config/musicLibrary.json', 'utf8')
        )
        musicLibrary.push({ url, filename })
        writeFileSync(
          './src/config/musicLibrary.json',
          JSON.stringify(musicLibrary)
        )

        ffmpeg(stream)
          .setFfmpegPath(this.ffmpegPath)
          .audioBitrate(128)
          .saveToFile(`./collection/${filename}.mp3`)
          .on('end', () => {
            resolve(filename)
          })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new Downloader()

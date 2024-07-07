import * as VLC from 'vlc-client'
import path from 'path'

import VLC_PASSWORD from '../private/VLC_PASSWORD'

class Player {
  vlc = new VLC.Client({
    ip: 'localhost',
    port: 8080,
    password: VLC_PASSWORD,
  })

  async addMusicToQueue(filename: string) {
    const uri = path.join(path.resolve(), `./collection/${filename}.mp3`)
    await this.vlc.addToPlaylist(uri)
    const isPlaying = await this.vlc.isPlaying()
    if (!isPlaying) {
      const playlist = await this.vlc.getPlaylist()
      if (playlist.length > 1) {
        await this.vlc.next()
        return
      }
      await this.vlc.togglePlay()
    }
  }
}

export default new Player()

import * as VLC from 'vlc-client'
import path from 'path'

import VLC_PASSWORD from '../private/VLC_PASSWORD'
import { PlaylistEntry } from 'vlc-client/dist/Types'

class Player {
  vlc = new VLC.Client({
    ip: 'localhost',
    port: 8080,
    password: VLC_PASSWORD,
  })

  async addMusicToQueue(filename: string): Promise<void> {
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

  async skipMusic(): Promise<void> {
    await this.vlc.next()
  }

  async clearQueue(): Promise<void> {
    await this.vlc.emptyPlaylist()
  }

  async showQueue(): Promise<PlaylistEntry[]> {
    const playlist = await this.vlc.getPlaylist()
    return playlist
  }
}

export default new Player()

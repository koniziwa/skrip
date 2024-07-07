type commandType = {
  command: string
  description: string
  required_status: string[]
}

const commands: commandType[] = [
  {
    command: 'users',
    description: 'Show users & roles',
    required_status: ['host', 'admin'],
  },
  {
    command: 'op',
    description: 'Assign {username} an admin role',
    required_status: ['host'],
  },
  {
    command: 'add',
    description: 'Assign {username} an user role',
    required_status: ['host', 'admin'],
  },
  {
    command: 'remove',
    description: 'Remove {username} privileges',
    required_status: ['host', 'admin'],
  },
  {
    command: 'order',
    description: 'Order track with {URL}',
    required_status: ['host', 'admin', 'user'],
  },
  {
    command: 'skip',
    description: 'Skip current track',
    required_status: ['host', 'admin'],
  },
  {
    command: 'clear',
    description: 'Clear queue',
    required_status: ['host', 'admin'],
  },
  {
    command: 'list',
    description: 'Show playlist',
    required_status: ['host', 'admin', 'user'],
  },
]

export default commands

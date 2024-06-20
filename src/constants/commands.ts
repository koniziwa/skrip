type commandsType = {
  command: string
  description: string
  required_status: string[]
}

const commands: commandsType[] = [
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
    description: 'Remove all {username} user privileges',
    required_status: ['host', 'admin'],
  },
  {
    command: 'order',
    description: 'Order track',
    required_status: ['host', 'admin', 'user'],
  },
  {
    command: 'skip',
    description: 'Skip current track',
    required_status: ['host', 'admin'],
  },
  {
    command: 'clear',
    description: 'Clear all current queue',
    required_status: ['host', 'admin'],
  },
]

export default commands

export default class Permissions extends Set {
  
  // Constructor that just makes an array :D
  constructor (...arr) {
    super(arr)

    // Pre-storage for remapping later
    const add = this.add.bind(this)
    const has = this.has.bind(this)

    // Remaps has and add for array and support
    this.has = function (perms) { return typeof perms === 'object' ? Array.isArray(perms) ? perms.every(p => has(p)) : perms instanceof Set ? Array.from(perms).every(p => perms.has(p)) : Object.keys(perms).every(p => has(p)) : has(perms) }
    this.add = function (perms) { return typeof perms === 'object' ? Array.isArray(perms) || perms instanceof Set ? perms.forEach(p => add(p)) : Object.keys(perms).forEach(p => add(p)) : add(perms) }
  }

  // Static method for getting permissions from a bitfield
  static find (bitfield, arr) {

    // First of all, convert 'perm' into a string of 1s and 0s
    bitfield = bitfield.toString(2)

    // Stores perms
    const perms = new Set()

    // Then take care of various perm types
    if (arr instanceof Object) arr = Object.keys(arr)
    if (!Array.isArray(arr)) throw new TypeError("'arr' not of applicable type!")

    // Loops through the bitfield string, adding a permission where it finds a '1'
    for (let i = bitfield.length - 1; i >= 0; i++)
      if (bitfield[i] === '1') perms.add(arr[i])

    // Returns the resulting permissions array
    return perms
  }
} // ~~used to be ;-;~~ 69 lines lol

// Discord perms
export const discord = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'VIEW_AUDIT_LOGS', 'VOICE_PRIORITY_SPEAKER', 'VOICE_STREAM', 'STREAM', 'VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'VOICE_CONNECT', 'VOICE_SPEAK', 'VOICE_MUTE_MEMBERS', 'VOICE_DEAFEN_MEMBERS', 'VOICE_MOVE_MEMBERS', 'VOICE_USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS', 'USE_SLASH_COMMANDS', 'VOICE_REQUEST_TO_SPEAK'] //['createInstantInvite', 'kickMembers', 'banMembers', 'administrator', 'manageChannels', 'manageGuild', 'addReactions', 'viewAuditLog', 'viewAuditLogs', 'voicePrioritySpeaker', 'voiceStream', 'stream', 'viewChannel', 'readMessages', 'sendMessages', 'sendTTSMessages', 'manageMessages', 'embedLinks', 'attachFiles', 'readMessageHistory', 'mentionEveryone', 'useExternalEmojis', 'externalEmojis', 'viewGuildInsights', 'voiceConnect', 'voiceSpeak', 'voiceMuteMembers', 'voiceDeafenMembers', 'voiceMoveMembers', 'voiceUseVAD', 'changeNickname', 'manageNicknames', 'manageRoles', 'manageWebhooks', 'manageEmojis', 'useSlashCommands', 'voiceRequestToSpeak'];
import { mentions } from "../../../func/f"


export default {

  f(m, { embed, args, content }) {

    if(!args[0])
      return m.channel.send(embed.t("You need to specify who to ban!"))

    const user = mentions(args.splice(0, 1))[0];

    if(!user)
      return m.channel.send(embed.t("Please provide a valid user!"))

    const days = Number(args[0]),
          reason = (days ? args.slice(1) : args).join(" ") || "none";

    try {
      const banned = await m.guild.members.ban(user, { reason });
      return m.channel.send(embed.t(`User ${banned.username} (ID: ${banned.id}) is successfully banned.`).d("Reason provided: " + reason))
    } catch(err) {
      m.channel.send(embed.t("An error occurred:", "```\n" + err + "\n```").c("red"))
    }

  },

  // Only to be used in servers
  chnl: "text",

  // You should be able to ban people normally too
  perms: "BAN_MEMBERS",

  // For fun ;)
  alt: ["bam"]
}
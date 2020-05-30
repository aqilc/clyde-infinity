module.exports = {

	// Function executed
	f(m, { content, embed }) {
		m.channel.send("WIP xP");
	},

	// Aliases (Array<String>)
	a: [],

	// Description
	d: "This command does things",

	// Examples (String`example1,example2`)
	e: "cmdname,cmdname hello",

	// How to use the command
	u: "commandname [username]",

	// Hidden from a regular user (Optional)
	h: false,

	// Delete (Optional)
	del: false,

	// Default version of the command (Optional)
	dver: "basic"
};
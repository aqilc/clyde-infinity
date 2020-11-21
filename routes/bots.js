
// Koa routes creator
import Router from 'koa-router'

// Bots router
export const bots = new Router()

bots.get('/', ctx => ctx.body = 'bots')

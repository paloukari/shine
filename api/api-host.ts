import * as chalk from 'chalk';
import * as Koa from 'koa';
import router from './routes';

import * as bodyParser from 'koa-bodyparser';
import * as server from 'koa-static';
import * as compress from 'koa-compress';


// Save your local vars in .env for testing. DO NOT VERSION CONTROL `.env`!.
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
   require('dotenv').config();
}

const app = new Koa();
const port = process.env.PORT || 3000;


async function exceptionHandler(ctx: Koa.Context, next: () => Promise<any>) {
   try {
      await next();
   } catch (err) {
      console.log(chalk.white.bgRed(`ERROR:  ${err}`));
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
   }
}
async function responseTime(ctx: Koa.Context, next: () => Promise<any>) {
   let start = Date.now();
   await next();
   const ms = Date.now() - start;
   ctx.set('X-Response-Time', `${ms}ms`);
}

async function logger(ctx: Koa.Context, next: () => Promise<any>) {
   await next();
   if (ctx.status !== 200) {
      console.log(chalk.red.bold(`${ctx.status}:${ctx.url}`));
   } else {
      if (ctx.url.startsWith('/api')) {
         console.log(chalk.blue.bold(`${ctx.status}:${ctx.url}`));
      } else {
         console.log(chalk.yellow.bold(`${ctx.status}:${ctx.url}`));
      }
   }
}

app.use(exceptionHandler)
   .use(responseTime)
   .use(logger)
   .use(compress())
   .use(server('./', { index: 'index.html', defer: true, maxage: 10000, gzip: true }))
   .use(bodyParser())
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(port, () => console.log(chalk.white.bgGreen.bold(`Listening on port ${port}`)));

export default app;

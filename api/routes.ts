import { Request } from 'koa';
import * as Router from 'koa-router';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as xml2js from 'xml2js';


if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
   require('dotenv').config();
}

let l2trnlist = fs.readFileSync(process.env.TRANSACTIONS_INDEX, 'utf8');
let l2trnlistParsed: any;

xml2js.parseString(l2trnlist, function (err, result) {

    l2trnlistParsed = result;
});

const router = new Router({
    prefix: '/api'
});


router.get('/transactions/:id', async (ctx, next) => {
    await next();
    ctx.status = 404;

    if (l2trnlistParsed && l2trnlistParsed.application && l2trnlistParsed.application.trngroup &&
    l2trnlistParsed.application.trngroup.length > 0) {
        (l2trnlistParsed.application.trngroup as Array<any>).forEach(group => {
            if (group.trn && group.trn.length > 0) {
                (group.trn as Array<any>).forEach(trn => {
                    if (trn && trn.$ && trn.$.id && ctx.params.id === trn.$.id) {
                        console.log(`${trn.$.filename} ${trn.$.description}`);
                        ctx.body = trn.$;
                        ctx.status = 200;
                        return;
                    }
                });
            }
        });
    }
});


router.get('/transactionFiles/:filename', async (ctx, next) => {
    await next();
    ctx.status = 404;

    let file = fs.readFileSync(`${process.env.TRANSACTIONS_DIRECTORY_PATH}${ctx.params.filename}.xml`, 'utf8');
    if (file) {
        ctx.body = file;
        ctx.status = 200;

    }
});


export default router;

interface IKoaRequestWithBody extends Router.IRouterContext {
    request: IKoaBodyParserRequest;
}

interface IKoaBodyParserRequest extends Request {
    body: any;
}

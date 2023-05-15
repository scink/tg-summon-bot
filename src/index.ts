import {getBot} from './bot';
import {TELEGRAM_TOKEN} from './token';

console.log(`the token is ${TELEGRAM_TOKEN}`);
getBot(TELEGRAM_TOKEN);

import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import winston, { Logger, createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';

const { combine, timestamp, printf } = format;
const logger:Logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message} (Accessing Port: ${process.env.PORT || 'Unknown'})`)
  ),
  transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'app.log' })
  ]
});

import accountsRouter from './routes/accounts' // 口座一覧照会
import myaccountRouter from './routes/myaccount'; // 自分の口座→イベント用口座へ振替
import eventaccountRouter from './routes/eventaccount'; // イベント用口座の残高照会
import transactionsRouter from './routes/transactions'; // イベント用口座の入出金明細照会
import toSpAccountRouter from './routes/toSpAccount'; //イベント用口座→つかいわけ口座へ振替
import indexRouter from './routes/index';

dotenv.config();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//cors問題
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/accounts', accountsRouter);
app.use('/api/myaccount', myaccountRouter);
app.use('/api/eventaccount', eventaccountRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/toSpAccount', toSpAccountRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

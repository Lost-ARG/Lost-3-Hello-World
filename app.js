var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
// 初始化 Day.js 插件
dayjs.extend(utc);
dayjs.extend(timezone);

const multer = require('multer');
const session = require('express-session');
const sessionConfig = require('./config/session');
const connectDB = require('./database');
const scheduler = require("./scheduler");

var indexRouter = require('./routes/page');
var apiRouter = require('./routes/api');

// 設定時區
const timeZone = "Asia/Taipei";

var app = express();
app.enable("trust proxy");

app.use(session(sessionConfig));
connectDB();

// 初始化 scheduler
scheduler.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 自定義 Morgan 的日誌格式，添加時區時間戳
logger.token("date", () => {
  return dayjs().tz(timeZone).format("YYYY-MM-DD HH:mm:ss Z");
});

app.use(logger("[:date] :remote-addr :method :url :status :res[content-length] - :response-time ms "));
app.use(express.json());
app.use(multer().array());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

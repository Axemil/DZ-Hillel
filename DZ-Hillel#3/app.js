const { color_Array, EXT_Array, deep, search, name } = require('./parse');
const { Finder } = require('./finder')
const { logger } = require("./loger")

const baseDir = "./assets";
const finder = new Finder(color_Array, EXT_Array, deep, baseDir, search, name);

finder.emit('started')

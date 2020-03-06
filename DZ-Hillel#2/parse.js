const parseArgs = require("minimist")(process.argv.slice(2));

parseArgs.EXT === undefined ||
parseArgs.color === undefined ||
parseArgs.deep === undefined
  ? process.exit(-1)
  : ({ EXT, color, deep } = parseArgs);

const EXT_Array = EXT.slice(1, -1).split(",");
const color_Array = color.slice(1, -1).split(",");
deep < 1 || !Number.isInteger(deep) ? deep = 1 : deep;

module.exports = {
  EXT_Array,
  color_Array,
  deep
}
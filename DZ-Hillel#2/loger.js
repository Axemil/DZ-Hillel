const chalk = require('chalk')
const { color_Array } = require('./parse')
let counter = 0;

const logger = file => {
  if (counter >= color_Array.length) {
    counter = 0;
  }
  const color = color_Array[counter]
  switch (color) {
    case "black":
      console.log(chalk.black(file));
      break;
    case "red":
      console.log(chalk.red(file));
      break;
    case "green":
      console.log(chalk.green(file));
      break;
    case "blue":
      console.log(chalk.blue(file));
      break;
    case "yellow":
      console.log(chalk.yellow(file));
      break;
    case "magenta":
      console.log(chalk.magenta(file));
      break;
    case "white":
      console.log(chalk.white(file));
      break;
    case "gray":
      console.log(chalk.gray(file));
      break;
    default:
      console.log(chalk.gray(file));
      break;
  }
  counter++;
};

module.exports = {
  logger
}
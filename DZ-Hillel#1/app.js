const { readdir, statSync, stat } = require("fs");
const parseArgs = require("minimist")(process.argv.slice(2));
const chalk = require("chalk");
const { extname, join } = require("path");
var { eachSeries } = require('async');

//Методы подключения файлов
const { minus } = require("./modulesIncludes/minus.js");
const { multiply } = require("./modulesIncludes/multiply.js");
const global = require("./modulesIncludes/plus");
console.log("Module.exports метод: ", minus(2, 3));
console.log("Exports.method метод: ", multiply(2, 3));
console.log("Global метод: ", plus(3, 4));

//Работа с директорией
const { EXT, color, deep } = parseArgs;

const EXT_Array = EXT.split(",");
const color_Array = color.split(",");

const checkExtension = extension => {
  for (const EXT_part of EXT_Array) {
    if (extension === EXT_part) return true;
  }
  return false;
};

let counter = 0;
let colorItem = color_Array[counter];

const deepCounter = (path) => {
  let counter = 0;
  for(const symbol of path){
    if(symbol.match(/\\/)) counter++;
  }
  return counter;
}

const showFile = (file, color='gray') => {
  if(deepCounter(file) <= deep){
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
    }
  }
  else return

};

console.log("Вывод файлов: ");
const baseDir = './assets'

const displayFiles = (files) => {
  for (const file of files) {
    if (counter >= color_Array.length) {
      counter = 0;
    }
    colorItem = color_Array[counter]
    if(EXT_Array[0] === ''){
      if(color_Array[0] === '') showFile(file);
      else showFile(file, colorItem)
    }
    else if (checkExtension(extname(file))) showFile(file, colorItem);
    counter++;
  }
}

const getFiles = (dirPath, callback) => {

  readdir(dirPath, (err, files) => {
      if (err) return callback(err);

      let filePaths = [];
      eachSeries(files, (fileName, eachCallback) => {
          let filePath = join(dirPath, fileName);

          stat(filePath, (err, stat) => {
              if (err) return eachCallback(err);

              if (stat.isDirectory() && deep > 0) {
                  getFiles(filePath, (err, subDirFiles) => {
                      if (err) return eachCallback(err);

                      filePaths = filePaths.concat(subDirFiles);
                      eachCallback(null);
                  });

              } else {
                  if (stat.isFile()) {
                      filePaths.push(filePath);
                  }

                  eachCallback(null);
              }
          });
      }, (err) => {
          callback(err, filePaths);
      });

  });
}


getFiles(baseDir, (err, files) => {
  displayFiles(files)
});
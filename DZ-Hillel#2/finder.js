const { readdir, stat } = require("fs");
const { extname, join } = require("path");
const { eachSeries } = require("async");
const EventEmitter = require("events");
const { homedir } = require("os");
const { logger } = require("./loger");

class Finder extends EventEmitter {
  constructor(colors = "gray", EXT, deep = 1, dirname = homedir()) {
    super();
    this.baseDir = dirname;
    this.color_Array = colors;
    this.EXT_Array = EXT;
    this.deep = deep;

    this.counter = 0;
    this.filePaths = [];

    this.dirs = 0;
    this.files = 0;

    this.on("started", () =>
      this.getFiles(this.baseDir, (err, files) => {
        this.emit('finish', files)
      })
    );


    this.on('dir', () => this.dirs++)
    this.on('file',() => this.files++)
 
    this.on("finish", files => {
      this.displayFiles(files)
      console.log("Было просканированно: ", this.files,'файлов, и', this.dirs, 'папки');
    });
  }

  getFiles(dirPath, callback) {
    readdir(dirPath, (err, files) => {
      if (err) return callback(err);

      let filePaths = [];
      this.filePaths = filePaths;
      eachSeries(
        files,
        (fileName, eachCallback) => {
          let filePath = join(dirPath, fileName);

          stat(filePath, (err, stat) => {
            if (err) return eachCallback(err);

            if (stat.isDirectory()) {
              this.emit('dir', filePath)
              this.getFiles(filePath, (err, subDirFiles) => {
                if (err) return eachCallback(err);

                filePaths = filePaths.concat(subDirFiles);
                eachCallback(null);
              });
            } else {
              if (stat.isFile()) {
                this.emit('file')
                filePaths.push(filePath);
              }

              eachCallback(null);
            }
          });
        },
        err => {
          callback(err, filePaths);
        }
      );
    });
  }

  displayFiles(files) {
    for (const file of files) {
      if (
        (this.EXT_Array[0] === "" || this.checkExtension(extname(file))) &&
        this.deepCounter(file) <= this.deep
      )
        logger(file);
    }
  }

  checkExtension(extension) {
    for (const EXT_part of this.EXT_Array) {
      if (extension === EXT_part) return true;
    }
    return false;
  }

  deepCounter(path) {
    let counter = 0;
    for (const symbol of path) {
      if (symbol.match(/\\/)) counter++;
    }
    return counter;
  }

}

module.exports = {
  Finder
};

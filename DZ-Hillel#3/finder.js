const { readdir, stat, createReadStream } = require("fs");
const { extname, join, basename } = require("path");
const { eachSeries } = require("async");
const EventEmitter = require("events");
const { homedir } = require("os");
const { logger } = require("./loger");
const FileType = require("file-type");

class Finder extends EventEmitter {
  constructor(colors = "gray", EXT, deep = 1, dirname = homedir(), search, name) {
    super();
    this.baseDir = dirname;
    this.color_Array = colors;
    this.EXT_Array = EXT;
    this.deep = deep;
    this.search = search;
    this.name = name

    this.counter = 0;
    this.filePaths = [];

    this.dirs = 0;
    this.files = 0;

    this.on("started", () =>
      this.getFiles(this.baseDir, (err, files) => {
        this.emit("finish", files);
      })
    );

    this.on("dir", () => this.dirs++);
    this.on("file", () => this.files++);

    this.on("finish", files => {
      this.displayFiles(files);
      console.log(
        "Было просканированно: ",
        this.files,
        "файлов, и",
        this.dirs,
        "папки"
      );
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
              this.emit("dir", filePath);
              this.getFiles(filePath, (err, subDirFiles) => {
                if (err) return eachCallback(err);

                filePaths = filePaths.concat(subDirFiles);
                eachCallback(null);
              });
            } else {
              if (stat.isFile()) {
                this.emit("file");
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

  async displayFiles(files) {
    let array = [];
    for (let file of files) {
      let result = await this.scan(file);
      if (result !== undefined){
        array.push(result);
        logger(result)
      }
    }
  }

  async scan(file) {
    const rs = createReadStream(file, { encoding: "utf-8" });
    const Ext = await FileType.fromFile(file);
    const str = await this.scanFile(rs);
    if (
      Ext !== undefined &&
      this.checkExtension(basename(file) + "." + Ext.ext) &&
      this.deepCounter(file) <= this.deep
    ) {
      return file;
    }
    else if (
      this.checkExtension(basename(file)) &&
      this.deepCounter(file) <= this.deep 
      
    ) {
      
      return [file,"Искомое слово: "+this.scanText(str)]
    }
  }

  scanText (str) {
    const match = str.match(this.search);
    return match[0];
  }

  async scanFile(rs) {
    for await (let chunk of rs) {
      return chunk;
    }
  }

  checkExtension(file) {
    if(file.match(this.name)) return true;
    return false
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

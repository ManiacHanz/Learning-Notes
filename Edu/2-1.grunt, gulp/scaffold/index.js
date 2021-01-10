import yargs from "yargs";

// 读取命令行文件夹 执行不同操作
const fl = yargs
  .commandDir("command")
  .demandCommand(1, "")
  .middleware((argv) => {
    if (argv.dryRun) {
      console.log(argv);
      process.exit(0);
    }
  })
  .fail(function (msg, err) {
    err && console.log(err);
    msg && console.log(msg);
    process.exit(1);
  })
  .alias("help", "h")
  .alias("version", "v");

export default fl.help().argv;

export { fl };
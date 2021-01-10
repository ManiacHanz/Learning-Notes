/**
 * fl weapp add sso
 * fl weapp import
 * fl weapp release
 *
 * WEAPP_CI_KEY: 小程序秘钥
 * CI_VERSION: 小程序版本
 * CI_MESSAGE: 上传描述
 */

import { Argv } from "yargs";
import scalffold, { getTemplateUrl } from "../utils/scaffold";
import ci from "../utils/ci";

interface ArgType {
  action: string;
  version?: string;
  desc?: string;
  name?: string;
  dest?: string;
}

export const handler = async (args: ArgType) => {
  const { action, name, ...ctx } = args;
  switch (action) {
    case "preview":
      ci.preview(ctx);
      break;
    case "upload":
      await ci.upload(ctx);
      break;
    case "add":
      const { dest } = args;
      // 查询 presets
      const url = await getTemplateUrl(name, "weapp-add");
      await scalffold(url, dest.endsWith("/") ? dest + name : dest, {
        ...args,
        action: "weapp-add",
      });
      break;
    default:
      break;
  }
};

export const builder = (yargs: Argv) => {
  yargs
    .positional("action", {
      description: "操作",
      required: true,
      choices: ["add", "upload", "preview"],
    })
    .positional("name", {
      description: "插件名称",
    })
    // .default("minify", "默认不开启压缩", false)
    .options({
      qr: {
        description: "二维码格式",
        choices: ["image", "base64", "terminal"],
        default: "terminal",
      },
      minify: {
        description: "是否压缩",
        type: "boolean",
      },
      version: { default: process.env.CI_COMMIT_TAG },
      branch: {
        description: "分支",
      },
      es7: {
        default: true,
        type: "boolean",
        description: "是否开启增强编译",
      },
      dest: {
        description: "自定义安装目录, 注意斜杠结尾",
        default: "package/",
      },
      desc: {
        default: process.env.CI_COMMIT_MESSAGE,
      },
    });
};

export const command = "weapp <action> [name]";

export const desc = "小程序工具集";

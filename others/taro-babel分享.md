
### 为什么要学关于编译的理论？

先看两个例子，都是「家庭医生」开发中遇到的问题

##### 每个页面都要加入AuthModal

这个问题如果是用react写普通的h5，就简单多了，我们只需要使用`createProtal`在最外层的组件中加一个和路由平级就行了，所有页面都可以共用一个`component`，但是用taro开发小程序此发却行不通，即使手动加入到`<Provider>`组件内也无法渲染到页面中。在微信开发者工具里面检查元素我们能发现微信最外层的`<Page>`我们控制不了，而`<Page>`就是我们每一个页面需要渲染的元素，根本无法通用一个。那我们就只能在每一个页面中去手动添加吗？

##### webpack独有却非常好用的api -- require.context（去中心化引入）

这是一个让我纠结了很久的功能，可以小程序却并不能，很是恼火。用我发一段代码，就能看出有什么用了

```js
// 情景1  ant-design 中的 index.js
// 去中心化的引用所有的样式文件 不需要像普通路由一样，每个都需要维护，而只是通过正则去匹配引入相应的文件模块
// 关键词  require.context
const req = require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.tsx?$/);

req.keys().forEach((mod) => {
  let v = req(mod);
  if (v && v.default) {
    v = v.default;
  }
  const match = mod.match(/^\.\/([^_][\w-]+)\/index\.tsx?$/);
  if (match && match[1]) {
    if (match[1] === 'message' || match[1] === 'notification') {
      // message & notification should not be capitalized
      exports[match[1]] = v;
    } else {
      // 转换驼峰写法名称暴露出去
      exports[camelCase(match[1])] = v;
    }
  }
});
```

```js
// 情景2  项目中的src/model/index 文件
import router from './business/router';
import request from './business/request';
import storage from './business/storage';
// ...
import familyDoctor from '../pages/familyDoctor/model'; //家庭医生首页
import clinicList from '../pages/clinicList/model'; //诊所列表
import clinicSelect from '../pages/clinicSelect/model'; //选择科室医生
// ...

//公共服务
const builtin = [
    appModel,
    router,
    storage,
    // ...
];

//业务模块
export default builtin.concat([
    familyDoctor,
    clinicList,
    clinicSelect,
    // ....
])
```

没有比较就没有伤害！上面两个问题，在其他环境下都是有解决方案的，在小程序中也当然可以通过重复劳动解决，但是如果有一种方法能代替这些机械的重复劳动，何乐而不为呢？

### 为什么要用到编译

taro就像一个黑盒，暴露出来的一部分配置，只能让我们稍微灵活的配置一些参数，却没有办法介入到它的规则里面去。*换句话说，如果官方没有让你减少这些劳动，你就没办法减少。*原因是`taro-build`的过程会首先分析依赖，然后根据依赖来生成和编译文件，其他环境中可以动态的去分析到，而taro一但分析完成，即使把`require('./a.js')`变成`require('./b.js')`，也不会重新打包b文件里的内容。所以我们只能在分析依赖前去修改。

当然我们也可以通过node里的`fs`模块，去读取文件中的内容，或者用`writeFile`写入内容，但这里说一个新的方法，通过编译


### 关于taro跨平台的秘密 -- ast和babel

> 万里长征第零步：编译就是把一段字符串改成另外一段字符串

比如说我们要把一段JSON中键名`foo`改成`bar`，这就是最简单的代码编译
```js
jsonStr.replace(/(?<=")foo(?="\s*:)/i, 'bar')   
```

而复杂的代码编译，就需要了解**抽象语法树(Abstract Syntax Tree)**以及**babel**

##### AST

![AST](https://user-gold-cdn.xitu.io/2018/10/8/166515483b7fa7c0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先是 Parse，将代码解析（Parse）成抽象语法树（Abstract Syntex Tree），然后对 AST 进行遍历（traverse）和替换(replace)（这对于前端来说其实并不陌生，可以类比 DOM 树的操作），最后是生成（generate），根据新的 AST 生成编译后的代码。

举个例子，来自[babel-handing-book](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91asts)

```js
function square(n) {
  return n * n;
}
```

下面是上面代码的AST

```js
- FunctionDeclaration:
  - id:
    - Identifier:
      - name: square
  - params [1]
    - Identifier
      - name: n
  - body:
    - BlockStatement
      - body [1]
        - ReturnStatement
          - argument
            - BinaryExpression
              - operator: *
              - left
                - Identifier
                  - name: n
              - right
                - Identifier
                  - name: n
```

或者换成对象的形式来看

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

##### babel -- Javascript编译器

*通俗的说，babel就是把你交给他的代码，通过一些规则更改以后，生成新的代码*

处理步骤分为3个阶段： **解析， 转换， 生成**

* 解析： 把代码parse成AST的阶段。分为**词法分析**和**语法分析**

* 转换： 接受AST，并对其中的节点进行增删改查等操作，这儿是babel最复杂最主要的阶段

* 生成： 把AST重新生成代码字符串，同时还附带sourcemaps等的过程

taro用到的babel模块主要有下面几个

* Babylon - Babel 的解析器。最初是从 Acorn 项目 fork 出来的。Acorn 非常快，易于使用，并且针对非标准特性(以及那些未来的标准特性) 设计了一个基于插件的架构。
* Babel-traverse - 负责维护整棵树的状态，并且负责替换、移除和添加节点。
* Babel-types - 一个用于 AST 节点的 Lodash 式工具库， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用。
* Babel-generator - Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）。
* Babel-template - 另一个虽然很小但却非常有用的模块。 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成大规模 AST 的时候。

```js
import * as babylon from "@babel/parser";
import traverse from "babel-traverse";

import * as t from "babel-types"; 

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

// 转换阶段
// 对AST树种的节点进行增删改查等操作
// 也是babel插件介入的步骤
traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
    // 使用babel-types
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

通过再解析出来的代码，就会变成

```js
function square(x) {
  return x * x;
}
```





compileScriptFile

### 关于transform-wx

编译成小程序能运行的代码的核心内容，举个转换config的例子

在组件里我们都可以声明一个config属性，最终这个属性并没有被放在wxml或者是js文件里，而是被放在了组件的json文件里，形成了符合小程序条件的配置文件，我们接下来大概看一下，这一块的解析原理

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class Home extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

}
```

```js
// 1. babel-traverse方法， 遍历和更新节点
traverse(ast, {  
  ClassProperty(astPath) { // 遍历类的属性声明
    const node = astPath.node
    if (node.key.name === 'config') { // 类的属性名为 config
      configObj = traverseObjectNode(node)
      astPath.remove() // 将该方法移除掉
    }
  }
})

// 2. 遍历，解析为 JSON 对象
function traverseObjectNode(node, obj) {
    //根据类型判断的递归
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
      obj = {}
      properties.forEach((p, index) => {
        obj[p.key.name] = traverseObjectNode(p.value)
      })
      return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    obj = {}
    properties.forEach((p, index) => {
      // const t = require('babel-types')  AST 节点的 Lodash 式工具库
      const key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

// 3. 写入对应目录的 *.json 文件
fs.writeFileSync(outputPageJSONPath, JSON.stringify(configObj, null, 2))

```


稍微看一下编译的核心`transform`函数，可以从入口`build`一直往下找会找到这里

```js
// @tarojs/transformer-wx/lib/src/index.js

function transform(options) {
  // ... 适配其他环境 

  // 清空第三方组件的常量
  // 这个constant_1对象记录了许多对象，后面需要用这个常量来分析依赖
  // 所以在分析之前先清空
    constant_1.THIRD_PARTY_COMPONENTS.clear();
    // 非ts 的code ,ts需要另外处理
    const code = options.isTyped
        ? ts.transpile(options.code, {
            jsx: options.sourcePath.endsWith('.tsx') ? ts.JsxEmit.Preserve : ts.JsxEmit.None,
            target: ts.ScriptTarget.ESNext,
            importHelpers: true,
            noEmitHelpers: true
        })
        : options.code;

    options.env = Object.assign({ 'process.env.TARO_ENV': options.adapter || 'weapp' }, options.env || {});
    // 这里是个幌子，本来以为这里可以把config里面的plugin配置过来，但其实并不是
    // 这里是在外层调用的时候传来的对象
    // 是根据调用transform不同情况下给的不同的option，和最外层的配置的plugin无关
    // const transformResult = wxTransformer({
    //   code: entryFileCode,
    //   sourcePath: entryFilePath,
    //   sourceDir,
    //   outputPath: outputEntryFilePath,
    //   isApp: true,
    //   // ...
    // });
    options_1.setTransformOptions(options);
    utils_1.setting.sourceCode = code;
    // 这里表示是否用redux，用redux后面会处理数据的作用域
    let hasReduxBinding = false;
    // 这个才是通过bable-core parse成ast的核心
    // 也就是说 这里的第二个参数 才是编译过去的参数，而插件就是在这里面去介入
    const ast = babel_core_1.transform(code, options_1.buildBabelTransformOptions()).ast;
    // 比如 在处理npm包或者里面的script的时候这里会变成true
    // 会直接在这一步就把ast返回，而不走下面的
    // 而这个ast返回之后会根据类型的不同进行不同的处理，大概也是以另外的方式和插件进行parse
    if (options.isNormal) {
        // ..something
        return { ast };
    }
    
    let result;
    const componentSourceMap = new Map();
    const imageSource = new Set();
    const importSources = new Set();
    const classMethods = new Map();
    let componentProperies = [];
    let mainClass;  // path
    let storeName;  // 处理Provider上的store属性
    let renderMethod;  // render方法
    let isImportTaro = false;
    babel_traverse_1.default(ast, {
        Program: {
            exit(path) {
            }
        },
        MemberExpression(path) {
            // 处理第三方组件，主要是config里面声明的
            // 会放入到constant_1的对象里
        },
        JSXText(path) {
           // 把有内容的文本节点，通过<Text></Text> 包裹
        },
        TemplateLiteral(path) {
            // ...
        },
        ClassDeclaration(path) {
            // 赋值mainClass = path
            mainClass = path;
            const superClass = utils_1.getSuperClassCode(path);
            // 处理superClass
        },
        ClassExpression(path) {
            mainClass = path;
        },
        ClassMethod(path) {
            if (t.isIdentifier(path.node.key)) {
                if (path.node.key.name === 'render') {
                    renderMethod = path;
                }
                classMethods.set(path.node.key.name, path);
            }
        },
        IfStatement(path) {
            // ...
        },
        CallExpression(path) {
            // ... 处理一些函数调用
        },
        JSXMemberExpression(path) {
            const { property, object } = path.node;
            const jsx = path.parentPath.parentPath;
            if (jsx.isJSXElement()) {
                const componentName = `${object.name}${constant_1.CONTEXT_PROVIDER}`;
                jsx.node.openingElement.name = t.jSXIdentifier(componentName);
                if (jsx.node.closingElement) {
                    jsx.node.closingElement.name = t.jSXIdentifier(componentName);
                }
            }
        },
        JSXElement(path) {
           
        },
        JSXOpeningElement(path) {
            // 处理jsx模板变成小程序的模板
            // 比如把View变成div 把block变成block（quickapp环境）
            // 比如处理<Provider>翻译成View并且把store赋给storeName
            // 比如处理<Image>的src属性等（这个属性是字符串或者是变量的不同处理）
        },
        JSXAttribute(path) {
            // 对jsx属性的修改
            // 比如说 on 绑定的事件要修改成 bind ,style属性要修改等等
        },
        ClassProperty(path) {
            // 对组件中属性的修改
            // 比如说 render 
            // 比如说声明了 defaultProps 要在 声明data的时候赋值
            // on的要改成小程序的事件绑定，包括大小写规范等等
        },
        AssignmentExpression(path) {
            // ... 
        },
        ImportDeclaration(path) {
            // 对import的处理
            // 包括 Component在小程序中是关键字，这里会处理成__BaseComponent这样
            // 包括对taro默认包的一些prefix的处理
        }
    });
    if (!isImportTaro) {
        const specifiers = [
            t.importDefaultSpecifier(t.identifier('Taro')),
            t.importSpecifier(t.identifier(constant_1.INTERNAL_SAFE_GET), t.identifier(constant_1.INTERNAL_SAFE_GET)),
            t.importSpecifier(t.identifier(constant_1.INTERNAL_GET_ORIGNAL), t.identifier(constant_1.INTERNAL_GET_ORIGNAL)),
            t.importSpecifier(t.identifier(constant_1.INTERNAL_INLINE_STYLE), t.identifier(constant_1.INTERNAL_INLINE_STYLE)),
            t.importSpecifier(t.identifier(constant_1.GEL_ELEMENT_BY_ID), t.identifier(constant_1.GEL_ELEMENT_BY_ID)),
            t.importSpecifier(t.identifier(constant_1.GEN_COMP_ID), t.identifier(constant_1.GEN_COMP_ID)),
            t.importSpecifier(t.identifier(constant_1.GEN_LOOP_COMPID), t.identifier(constant_1.GEN_LOOP_COMPID))
        ];
        if (adapter_1.Adapter.type !== "alipay" /* alipay */) {
            specifiers.push(t.importSpecifier(t.identifier(constant_1.PROPS_MANAGER), t.identifier(constant_1.PROPS_MANAGER)));
        }
        ast.program.body.unshift(t.importDeclaration(specifiers, t.stringLiteral('@tarojs/taro')));
    }
    // ...alipay 兼容

    // 处理第三方的组件 加入usingComponent, 然后加入到组件的.json文件中
    mainClass.node.body.body.forEach(handleThirdPartyComponent);
    // 处理 Provider里的store的作用域
    const storeBinding = mainClass.scope.getBinding(storeName);
    // 防止变量名和小程序的冲突
    mainClass.scope.rename('Component', '__BaseComponent');
    if (storeBinding) {
        // 初始化整个store的逻辑
    }
    resetTSClassProperty(mainClass.node.body.body);
    if (options.isApp) {
        // 根据render方法，要把render方法里用到的state或者props绑定到小程序里需要用到的data里
        renderMethod.replaceWith(t.classMethod('method', t.identifier('_createData'), [], t.blockStatement([])));
        return { ast };
    }
    // 把修改后的AST交给babel处理
    // 这里的处理会加上config里的plugin配置的babel插件
    result = new class_1.Transformer(mainClass, options.sourcePath, componentProperies, options.sourceDir, classMethods).result;
    // 通过babel生成code
    result.code = babel_generator_1.default(ast).code;
    result.ast = ast;
    const lessThanSignReg = new RegExp(constant_1.lessThanSignPlacehold, 'g');
    result.compressedTemplate = result.template.replace(lessThanSignReg, '<');
    result.template = html_1.prettyPrint(result.template, {
        max_char: 0,
        unformatted: env_1.isTestEnv ? [] : ['text']
    });
    result.template = result.template.replace(lessThanSignReg, '<');
    result.imageSrcs = Array.from(imageSource);
    return result;
}

```

上面就是taro大概的流程，其唯一让我们提供babel-plugin配置的流程放在了taro自己修改配置的后面，也就是说，即使我们通过配置的自定义plugin去修改了代码，也无法让它重新去分析依赖等等，所以光靠config文件提供的plugin是行不通的



### 全局植入`AuthModal`

react中一般的全局弹窗是用`createPortal`来添加到指定的`container`下面，而小程序没有个页面都是一个`Page`，所以就有了自动在每个页面植入弹窗组件的办法


```js
// transform-wx/index
const ast = babel_core_1.transform(code, options_1.buildBabelTransformOptions()).ast;

// transform-wx/options
exports.buildBabelTransformOptions = () => {
    return {
        plugins: [/*  babel - plugins  */]
    }
}
```

`babel-core.transform`是把code变成ast的过程，而第二个参数把`babel`需要的配置通过另一个文件引进来。所以这里给我们在这个流程之前把这个方法复写的机会，最后再调用`@tarojs/build`就恢复到正常流程了

```js
const buildOptions = require('@tarojs/transformer-wx/lib/src/options');
 
// 也就是说，在执行这个函数的时候，就把taro-transform里的第二个参数改变了
// 通过这种hack的方法，强行植入了一个自定义的插件，也就是injectPlugins里面的参数
const injectPlugins = (plugins) => {
    const result = buildOptions.buildBabelTransformOptions()
    result.plugins.push(plugins)
    buildOptions.buildBabelTransformOptions = () => {
        // do something 
        return result;
    };
};

injectPlugins([ 
  /* custom bable plugin */ 
  [
    require('./custom-babel.js'),
    {
      id: 'AuthModal',      // 标签的t.JSXIdentifier()的参数名
      source: 'some path...',  // 用于植入import的路径参数
      exclude, // 不需要执行这个插件的路径
      include, // 需要植入的路径
    }
  ]
]);

require('@tarojs/cli/bin/taro-build');
```

通过这个过程，等于taro在build的第一时间，也就是根据import来生成文件之前，就把2个代码植入到了需要的JSX文件中，一个是`<AuthModal></AuthModal>`这样的标签，另一个是在顶部植入了`import AuthModal from '@/component/AuthModal'`，所以在后面的流程中能够顺利进行，下面是插件的源码

```js
let program;
let top;
let skip = false;

module.exports = function({ template, types: t , traverse}) {
  const visitor = {
    JSXElement(path, state) {
      // 如果收个jsx 是自闭的，不需要继续执行
      if (top || path.node.openingElement.selfClosing) {
        return;
      }
      const { id, source, exclude, include } = state.opts;
      const filename = state.file.opts.filename;
      
      if (exclude && filename.match(exclude)) {
        return;
      }
  
      if (include && !filename.match(include)) {
        return;
      }
  
      top = path;
      // 插入元素
      path.node.children.push(
        t.JSXElement(
          t.JSXOpeningElement(t.JSXIdentifier(id), []),
          null,
          [],
          true
        )
      );
  
      // body 插入 import 语句
      program.unshiftContainer(
        'body',
        t.importDeclaration(
          [t.ImportDefaultSpecifier(t.Identifier(id))],
          t.StringLiteral(source)
        )
      );
      
    }
  }
  return {
    pre(state) {
      // 文件是否 exclude
      top = null;
      body = null;
    },
    visitor: {
      Program: {
        enter(path) {
          // 查找jsx 元素
          program = path;
        },
      },

      ClassMethod (path, state) {
        // 保证必须是render方法里面的JSX元素，这样才能保证是在顶层元素内添加
        // 否则如果有些方法中return了JSX元素会导致不情愿的效果
        if(t.isIdentifier(path.node.key, {name: 'render'})){
            // 在这里面去操作JSX元素
            path.traverse(visitor, state)
        }
      }
    },
    // 完成后要把变量还原
    post(){
      top = null;
      body = null;
    }
  };
};
  

```

*大致讲完了，让我们回到最初的起点，如果让小程序兼容require.context呢？*

### 关于stylus

一般情况下，一个程序都只有一个主色，或者一个主字体等等，我们应该像js设置变量一样，给一些主要的属性设置一个变量来方便代码的维护。但是所有地方都去`@import`又会造成无谓的工作量

在一般的webpack项目中，我们只需要通过`loader`里面的配置项来搞定，比如说`@vue/cli`中的配置

```js
// 部分代码

// webpack.base.conf.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
        ]
    }
}

// vueLoaderConfig -> cssLoaders({sourceMap, extract})
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  // import 是关键
  var stylusOptions = {
    import: [
        path.join(__dirname, "../src/common/base.styl"), // base.styl全局变量文件
    ]
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus', stylusOptions),
    styl: generateLoaders('stylus', stylusOptions)
  }
}
```

而在Taro中的config文件中没有类似格式的配置，所以只有看看taro中的实现原理
**通过build然后找到对应的weapp.js，然后在`buildSingleComponent`里面编译时候会调用到样式插件**
这里直接找到`plugin-stylus`文件夹

```js
const stylus = require('stylus')

module.exports = function compileStylus (content, file, config) {
  return new Promise((resolve, reject) => {
    if (!content && !fs.existsSync(file)) {
      return resolve({
        css: ''
      })
    }
    if (!content) {
      content = fs.readFileSync(file).toString()
    }
    const opath = path.parse(file)
    config.paths = [opath.dir].concat(config.paths || [])
    config.filename = opath.base
    const instance = stylus(content, { filename: file })
    /*
        根据stylus文档的地址，如果在这里加一条
        就相当于在所有的.styl文件前自动添加了这个变量文件，可以不用手动添加
        但是在不修改源码的情况下这个办法显然行不通，所以需要另一个重要api use
    */
    /* instance.import('../variebles.styl') */


    // 通过这里的set可以把属性植入到实例里
    for (const k in config) {
      instance.set(k, config[k])
    }
    let imports = instance.deps()
   

    // render就相当于分析stylus生成新的ast
    // 所以需要在之前处理
    instance.render((err, css) => {
      if (err) {
        return reject(err)
      }
      resolve({
        css,
        imports
      })
    })
  })
}

```

最优解  stylus的 `set`配合`use`达到目的。就是说在不修改源码的情况下可以通过这两个的配合达到植入`stylus.import()`的效果
代码如下

```js
// config/index
var config = {
    plugins: {
        stylus: {
            use: [function(stylus){
                stylus.import('../variebles')
            }]
        }
    }
}

// 原理
// `new Renderer()`就是stylus的实例
// set就是把config里的所有配置都挂在了实例的options上面
Renderer.prototype.set = function(key, val){
  this.options[key] = val;
  return this;
};
// use的作用其实就是调用这个方法，注意use方法传进来的必须是一个fn
Renderer.prototype.use = function(fn){
  fn.call(this, this);
  return this;
};

Renderer.prototype.render = function(fn){
  var parser = this.parser = new Parser(this.str, this.options);

  // 调用options上的use属性里的所有fn
  // 通过set挂上来的use必须是一个数组，这里是文档中没有提到的
  // 会循环调用 所以可以传入多个类似的fn
  // function(stylus){ stylus.import('../variebles.styl') }
  for (var i = 0, len = this.options.use.length; i < len; i++) {
    this.use(this.options.use[i]);
  }

  // ...其他过程
};
```





附录

[ASTexplorer](https://astexplorer.net/)
在线组织抽象语法树

[Babel plugin handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)
一个相信的babel教程，并且有中文

[Babel-types](https://babeljs.io/docs/en/babel-types#docsNav)
babel操作ast的工具库文档

stylus [文档地址](https://stylus.bootcss.com/docs/js.html), [中文文档](https://www.zhangxinxu.com/jq/stylus/js.php)
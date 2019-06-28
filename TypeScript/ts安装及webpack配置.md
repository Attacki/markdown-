## 依赖包安装
```cmd
npm install typescript ts-loader --save-dev
```


## tsconfig.js
```json
{
    "complierOptions":{
        "module":"commonjs",
        "target":"es5",
        "allow":true
    },
    "inclued":[
        "./src/*"
    ],
    "exclude":[
        "./node_modules/"
    ]
}
```

## webpack配置
```js

module.exports = {
    ...

    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:'ts-loader'
            }
        ]
    }
}
```


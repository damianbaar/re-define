## re-define
Let's `re-define` something ... without any configuration ... just do the magic for me, yet another build tool.

Easy way to convert your AMD and CommonJS projects for WEB.

### Nice things
* when `re-define` meet external dep, automatically checks descriptor files, such as `bower.json` and `package.json`, there is also a fallback to `node_modules` as well as `bower_components` when descriptor is missing or there is no `main` defined, check `re-define-include-external` to get more details
* `re-define` make names for module appropriatelty to folder structure and expose it within given namespace which could be referenced further from any other different module, this is:
assuming your module is placed in folder `my_awesome_component` all internal modules are presented as `my_awesome_component/**`.
* ability to split modules based on `glob`, to extract common parts with ease
* automatically loads configuration from file `re-define.json`
* handling glob pattern
* when piping passing `vinyl` files

### Why
* to provide better support for `amd`
* to share code and expose more than one module within namespace and import from others
* to be able to handle all modern js build systems in one
* to generating templates tailored to your needs with all relevant information, i.e. external dependencies

### TODO
* incremental builds
* generating `sourcemaps`

### Limitation
* does not resolve circular dependencies
* resolve only static `require` statements

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [file/files or glob pattern] -[options]

Options:
```
```


Configuration examples:

* externals
`--external `{"lodash":"./vendor.lodash.js"}`

* globals
`--globals "async#libs.async"`, becomes `parent.lib.async`

* names
`--names {amd:"amd/name", global:"foo.baz.bar"}`

#### Example usage
check [example folder](examples/4) and appropriate build files

#### Debbuging
To run `re-define` in debug mode is fairly easy, just run `re-define` with appropriate category like below

```
//all
DEBUG=re-define:* 
```

#### How it works
* main require function allow to reference different `namespace`
* each module is wrapped in cjs wrapper
- do not modify cjs modules



###Config
```js
```

####Custom transforms
* [usage](/bin/re-define.js#L58)
* [example](https://github.com/damianbaar/re-define-include-external)

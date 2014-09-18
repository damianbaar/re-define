#### Example

How to use import/export namespaces and slice files.

#### Build
```
re-define components/lookup.js --namespace org.component > dist/components.js 
re-define my-site/index.js --imports this.org.component --namespace org.site > dist/my-site.js
```

#### Example

Real `jquery`, `d3` lib are used here. 

All internal modules are exposed within `org.chart` namespace.

#### Build
```
re-define index.js --namespace org.chart > bundle.js 
```

#### Compilation times
Just a few runs not so reliable.

```
//single run
re-define index.js        - 0.63s user 0.06s system 92% cpu 0.746 total
browserify index.js       - 0.73s user 0.07s system 84% cpu 0.941 total
webpack index.js test.js  - 0.95s user 0.07s system 100% cpu 1.014 total
duo index.js              - 1.39s user 0.10s system 100% cpu 1.492 total
```

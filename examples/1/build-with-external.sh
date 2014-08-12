re-define './lib/main.js' --base lib --returns 'main' --globals "async#async" -e '{"lodash":{"path": "./vendor/lodash.js", "deps": ["jquery"]}}' > bundle.js

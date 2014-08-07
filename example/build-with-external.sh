re-define './lib/main.js' --base lib --returns 'main' --globals "async#parent.async" -e '{"lodash":{"path": "./vendor/lodash.js", "deps": ["jquery"]}}' > bundle.js

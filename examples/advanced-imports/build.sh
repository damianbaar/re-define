re-define --cwd components '**/index.js' --namespace ns.org.components > components.js
re-define --cwd app app/index.js --imports ns.org.components --namespace ns.org.app --globals '{"jquery":"$"}' --wrapper 'global' > app.js

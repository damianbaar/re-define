re-define components/lookup.js --cwd components --namespace org.component --project-name components > dist/components.js 
re-define my-site/index.js --cwd my-site --imports this.org.component --namespace org.site > dist/my-site.js

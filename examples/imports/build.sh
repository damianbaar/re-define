re-define components/lookup.js --cwd components --namespace examples.imports.component --project-name components > dist/components.js 
re-define my-site/index.js --cwd my-site --imports examples.imports.component --namespace examples.imports.org.site > dist/my-site.js

bun build lib/create-trifrost.mjs \
  --outfile=bin/create-trifrost.cli.js \
  --target=node \
  --minify

# Prepend shebang
echo '#!/usr/bin/env node' | cat - bin/create-trifrost.cli.js > bin/tmp.js && mv bin/tmp.js bin/create-trifrost.cli.js

chmod +x bin/create-trifrost.cli.js

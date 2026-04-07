#/usr/bin/env sh

registry=https://registry.npmjs.org
if npm whoami --registry $registry 2> /dev/null; then
  echo "Already logged in to $registry"
else
  echo "Logging in to $registry"
  npm login --auth-type=web --registry $registry
fi

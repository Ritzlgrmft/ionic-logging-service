# calculate next version
npx semantic-release -p semantic-release-ado
echo $NEXTRELEASE
export NEXTRELEASE="aa"

# check if there is a new version
if [ "$NEXTRELEASE" ==  "" ] ; then echo "no new version"; exit; fi

echo "new version: $NEXTRELEASE"

# publish ionic-logging-service
npx semantic-release --pkgRoot dist/ionic-logging-service --dry-run

# publish ionic-logging-viewer
npm publish dist/ionic-logging-viewer --tag $NEXTRELEASE --dry-run

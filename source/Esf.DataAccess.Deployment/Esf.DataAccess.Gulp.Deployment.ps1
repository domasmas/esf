# Setup npm and gulp
cd $PSScriptRoot\..\Esf.DataAccess\
npm install
npm install --dev
# Builds generates the upgrade script in UpgradeOtput folder
npm run gulp generateUpgradeScripts

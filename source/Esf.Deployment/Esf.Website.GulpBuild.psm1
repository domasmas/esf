function EsfWebsiteGulpBuild() {
	$esfWebsiteProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.Website"
	cd $esfWebsiteProjectPath
	# Setup npm and gulp
	npm install
	npm install --only=dev
	# Builds JS files and LESS, and copies everything in debug mode to wwwroot folder
	npm run gulp build:release
}

Export-ModuleMember -Function EsfWebsiteGulpBuild
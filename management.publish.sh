cd app.management
ng build --prod --base-href "/bean-chain/"

cd ..
angular-cli-ghpages --dir app.management/dist/managment
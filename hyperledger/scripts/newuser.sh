rm -rf certificates
mkdir certificates
mkdir certificates/newcerts

touch certificates/index.txt
hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random > certificates/serial

openssl req -config openssl.cnf -nodes -new -newkey ec:<(openssl ecparam -name prime256v1) -keyout $1.key -sha256 -out $1.csr
openssl ca -config openssl.cnf -in $1.csr -out $1.crt -extensions v3_ca -md sha256
openssl x509 -inform PEM -outform PEM -in $1.crt -out $1.pem

rm -f $1.csr
rm -f $1.crt

rm -rf certificates

key=`cat $1.key`
cert=`cat $1.pem`

key=$(echo "${key//
/\\n}")

cert=$(echo "${cert//
/\\n}")

#cert=$(echo "$cert"|tr '\n' '\\n')

rm -rf $1.json

echo "{" >> $1.json
echo "  \"username\":\"$1\"," >> $1.json
echo "  \"mspid\":\"MainOrgMSP\"," >> $1.json
echo "  \"key\":\"$key\"," >> $1.json
echo "  \"cert\":\"$cert\"" >> $1.json
echo "}" >> "$1.json"

rm -f $1.key
rm -f $1.pem

mkdir -p ../identities/

mv $1.json ../identities/

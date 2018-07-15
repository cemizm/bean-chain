set -e

# Shut down the Docker containers for the system tests.
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down

# remove the local state
rm -f ~/.hfc-key-store/*

# remove chaincode container
docker rm $(docker ps -a -q --filter="name=dev-*")

# remove chaincode docker images
docker rmi $(docker images dev-* -q)
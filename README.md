# music-scales-api

> University project for 7th semester. \
> API for quick access to music scales.

## Table of Contents

- [General Information](#general-information)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Support](#support)
- [Contributions](#contributions)
- [Status](#status)

## General Information

Music Scales API is an API service built from microservices all running concurrently and connected to each other for a smooth UX and ease of development. The Contents of the project is not its main focus and it is lacking in usable data section.

Main focus for the project was to use all the technologies learnt and create a service that goes beyong the requirements set for the university project and to create a modern service that is up-to-date with current requirements and standards.

## Technologies Used
- Docker 27.2
- Docker Compose 2.29
- Node 20.15
- Vitest 3.0
- TypeScript 5.6
- Express 4.21
- Swagger UI 5.0
- Docusaurus 3.7
- gRPC JS 1.12
- Protobuf 2.2
- GraphQL 16.10
- Apollo 4.11
- MongoDB 8.0
- Nginx 1.27

# Project Structure

Project uses Docker to create containers for every service and to arrange them in a logical way.

Services:
- Nginx - web server used as a proxy between the end-user and accessible services to the public
- REST - public REST API implementing simple paths for resources following RESTful practices
- Apollo - public web service that uses GraphQL for accessing resources with built-in documentation
- gRPC - internal communication service that handles all transfers between public interfaces and databases
- Mongo - Non-relational database used as a storage for resources
- Swagger - public web service publicating documentation for REST API
- Docusaurus - public service to store general documentation (UNIMPLEMENTED in docker containers - will not be listed further in the instruction)

Volumes:
- Shared - internal files shared between containers
- Mongo Data - database data

Networks:
```
                   +-<<Server>>------------+
+-<<Client>>-------|----------+            |
|  +-<<Public>>-+  |  REST    |            |
|  |  Nginx     |  |  Apollo  |  +-<<Database>>-+
+--|------------|--|----------+  |  gRPC   |    |
   |  Swagger   |  +-------------|---------+    |
   +------------+                |  Mongo       |
                                 +--------------+
```

## Setup

To run the API you need Docker and Docker Compose installed on your computer. To develop code you will need Node and a code editor of your choosing.

### Config files

First, create `.env` file in the root structure with following data:

```bash
NGINX_IP=<public IP for nginx - 127.0.0.1>
NGINX_PORT=<port for nginx internal communication - 8044>
REST_PORT=<port for rest api internal communication - 8080>
APOLLO_PORT=<port for graphql internal communication - 8082>
GRPC_PORT=<port for grpc internal communication - 8084>
MONGO_PORT=<port for db internal communication - 27017>
MONGO_USERNAME=<name for db user - dbuser>
MONGO_PASSWORD=<password for db user>
MONGO_DATABASE=<name of the resource db collection - maindb>
SWAGGER_PORT=<port for swagger internal communication - 8086>
DOCUSAURUS_PORT=<port for docs internal communication - 8088>
```
> Do not copy the exact values, data in `<...>` are descriptions and examples. A proper value is e.g. `NGINX_IP=127.0.0.1`.

This will specify all the data required to run the services. Mainly the database user with proper privilages, database URI for accessing the database, publicly available IP address (set to 127.0.0.1 for local work) and all the ports for services to communicate with each other.

### Proto files

Next, generate TypeScript files from Protobufs with commands below (from root):
```bash
cd grpc/
npm run protoc:linux
```
> If you are on a machine with Windows, replace `protoc:linux` with `protoc:windows`.

This will generate all the TS files from Proto files and copy them to proper folders, which will get rid of most errors.

If you do not have `protoc` installed on your system, you will get an error. If you do not want to install `protoc` globally, you can install it locally in `grpc/` by running `npm install protoc` and then running included `protoc:<os>` script.

### GraphQL files (optional)

Lastly, generate Typescript files from GraphQL file with commands below (from root):
```bash
cd apollo/
npm i
npm run codgen
```
> This step is optional unless you wish to actively change the codebase for Apollo service.

This will generate all the TS files for Apollo and will get rid of the rest of the errors.

## Usage

You now can run all the containers with:
```bash
docker compose -f docker-compose.yaml up --build
```

To run docker containers with HMR (only for docker compose 1.22+) run:
```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build`.
```

To run docker containers with HMR and have unrestricted access to all containers (not only from nginx), run:
```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.debug.yaml up --build`.
```

Most services have Dockerfiles in them, which do:
- Nginx - pulls nginx:1.27.3-alpine, copies config file and runs service
- REST - pulls node:20-alpine and runs Express server
- Apollo - pulls node:20-alpine, runs codegen and runs Apollo Standalone Server
- gRPC - pulls node:20-alpine and runs gRPC Server
- Mongo - pulls mongo:latest, copies entrypoint file with sample data and runs database
- Swagger - pulls node:20-alpine and runs Express server

## Support

No updates or bugfixes will be made for this repository, but the idea, both from technology stack and the resource API aspects, might get revisited.

## Contributions

No contributions are or will be accepted, but you may fork or copy the repository and do whatever you want with it.

## Status

Project is not finished, but no new updates will be made to it. If it gets revisited, it will be available in a new repository.

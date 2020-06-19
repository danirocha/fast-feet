# Fast Feet

An API for a package distributor app

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Install [Node](https://nodejs.org/en/)
- Install [Yarn](https://yarnpkg.com/)
- Install [Postbird](https://www.electronjs.org/apps/postbird)
- Install [Docker](https://www.docker.com/products/docker-desktop)

### Installing

To install the project, follow the instructions below

- Navigate to the your project's folder

```cd ~/fast-feet/```

- run command

```yarn install```

### Running

To execute your project, follow the instruction below:

- With your Docker up, run the command

```docker run --name database -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres```

- Open your Postbird and use this connection info to access your database container:

```
  Host: localhost
  Port: 5432
  Username: postgres
  Password: root
  Database: fastfeet
```

- Navigate to the your project's folder

```cd ~/fast-feet/src```

- Run and populate your DB schema with the command

```yarn sequelize db:migrate && yarn sequelize db:seed:all```

- Now start the project the command

```yarn start```

## Built With

- [Node](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine
- [Sequelize](https://sequelize.org/) - A promise-based Node.js ORM
- [Yup](https://github.com/jquense/yup) - A JavaScript schema builder for value parsing and validation

## Authors

- **Daniela Rocha** - _Initial work_ - [Daniela](https://github.com/danirochae)

## Acknowledgments

- Commands that can help you cope with some problems:
- `docker ps` - Show status of your Docker containers that are up and running
- `docker ps -a` - Show status of all your Docker containers, even the stoped ones
- `docker rm <CONTAINER-ID>` - Removes a container
- `yarn sequelize db:migrate:undo` - To undo the DB schema

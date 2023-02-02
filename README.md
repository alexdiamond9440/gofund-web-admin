
# GoFundHer Web Admin

# Requirements
- Linux
- Node.js
- Npm

# Installation

## Connect to AWS EC instance
Using Putty or XShell to connect AWS EC2 instance that the project will be deployed on.

## Clone Code Repository
> git clone git@github.com:gofundher/gofundher-web-admin.git

> cd gofundher-web-admin

> npm install

## Setup configuration
Rename .env.development.local to .env and update the values for production.

# Build frontend files
> npm build

Rename build folder to admin and copy into gofundher-web-backend

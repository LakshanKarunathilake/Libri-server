  <p align="center">
    <img width="460" " src="https://firebasestorage.googleapis.com/v0/b/libri-238805.appspot.com/o/libri%20logo.png?alt=media&token=bec48934-d1c2-467f-b6d3-af1538aecaeb" />
  </p>

# Remote Library Assistant

![](https://img.shields.io/github/issues/LakshanKarunathilake/Libri-server)
![](https://img.shields.io/github/forks/LakshanKarunathilake/Libri-server)
![](https://img.shields.io/github/stars/LakshanKarunathilake/Libri-server) ![](https://img.shields.io/github/license/LakshanKarunathilake/Libri-server)
![](https://img.shields.io/github/repo-size/lakshankarunathilake/Libri-server)

## Technologies

  <p align="center" > 
  <img width="80" " src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-vertical.png" />
    <img width="200" " src="https://cloud.google.com/images/velostrata/cloud-lockup-logo.png" />


  </p>

## Features

- Cross platform mobile abbpplication based on Ionic Version 4.0
- Associated with a supportive dashboard called Libri-Admin
- All your library users can use the the library applications remotely
- New transfer capability between users without visiting the library
- Checking the books and the availability of books can be checked without visiting the library
- Users can transfer books without visiting the library
- Users can pay the penalties if the library authorized personal grant the permission
- Users will be able to receive the notices digitally and efficiently
- Any library have existing system can plug this application if the current system is based on Koha Library Management System or Ever green library system
- Library staff can embed a brief introduction about the statistics of the library

## System sub components

Aparat from the mobile application the application support a custom build dashboard called [Dashboard][dashboard] and a backend server with server deployed according to the serverless architecture called [LibriApp][libriapp]

### Installation Guide

** Pre-requisits**

| Tool           | Version   |
| -------------- | --------- |
| Node           | 10.11 LTS |
| Firebase tools | 7.6.2     |

Before doing anything make sure you are in the functions directory. To do that you have to

```sh
$  cd functions/
```

#### 1. Install Dependencies

```sh
$ npm install
$ npm i firebase-tools -g
```

#### 2. To deploy your updated functions to the Firebase functions

```sh
$ npm run deploy
```

This will launch an application preview inside your preffered browser

#### To serve the functions locally

```sh
$ npm run serve
```

#### Build your functions

```sh
$ npm run build
```

#### Replacing firebase configurations

You have to initialize the firebase project since this project by default is associated with firebase project. What you have to do is create a firebase project using firebase console and copy that id to the file **firebase.src**

```json
{
  "projects": {
    "default": "<YOUR_PROJECT_ID>"
  }
}
```

then you can follow the below scripts to deploy that to firebase cloud functions

```sh
$ firebase login
```

this command will let you login to your firebase gmail account and check whether you have valid permissions for the default project.

```sh
$ npm run deploy
```

This command will do a clean build and deploy to the cloud functions you should see following type of view in a successfull deployment.

#### Replacing credentials for mysql database queries

I am using a sample mysql database which is associated with **KOHA** library management system. I have added some sample users as well as **MARC 21** records. The mysql database connection details are added in the **functions/src/libri/app-functions.ts** file.

I will provide you a sample SQL file link here also for the KOHA mysql database.

```sh
const connectionName =  process.env.INSTANCE_CONNECTION_NAME || "libri-238805:asia-east1:libri";
const dbUser = process.env.SQL_USER || "libri-app";
const dbPassword = process.env.SQL_PASSWORD || "Manual@123";
const dbName = process.env.SQL_NAME || "koha";
```

You have to replace the above details then you successfully query the records.

#### Notes

- Make sure the user that you create for the connection is a read only user. This is for the secuirity purposes
- Deploy cloud functions by having seperation of concerns otherwise it will cost you more.

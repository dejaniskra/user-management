# Table of Contents

- [Introduction](#introduction)
- [Configuration Options](#configuration-options)
- [Configurable Settings](#configurable-settings)
- [Local Development](#local-development)
- [Architecture](#architecture)
- [Upcoming Features](#upcoming-features)
- [Documentation](https://github.com/dejaniskra/user-management/tree/main/docs)

## Introduction
This is a simple user service for every day, common usage. If you are looking for something to get you up and running, something that you can use to perform standard user and profile functions, including email verification and profile avatar management, this is the service for you! It is a highly customizable service that you can use as part of your larger app stack. So, what does this service do?
- User CRUD!
- Email verification!
- Profile CRUD!

## Configuration Options
1. Environment Variables passed to node -> process.env.__VARS__
2. Adding an .env file to the root of the project.

## Configurable Settings

| Variable    | Type        | Default     | Description |
| ----------- | ----------- | ----------- | ----------- |
| PORT      | number       | `7000`       | The port for the service to listen on.       |
| DATABASE_HOST      | string       | `none`       | The MongoDB host.       |
| DATABASE_PORT      | number       | `none`       | The MongoDB port.       |
| DATABASE_NAME   | string        | `none`        | The MongoDB database name that the service will create the necessary collections inside.        |
| DATABASE_USERNAME      | string       | `none`       | The MongoDB username.       |
| DATABASE_PASSWORD      | string       | `none`       | The MongoDB password.       |
| AWS_REGION      | string       | `us-east-1`       | The AWS region where your service is hosted.       |
| AWS_SQS_QUEUE_EMAILS_TYPE      | string       | `standard`       | The AWS SQSQueue type; this queue is responsible for processing emails. Available types are: 'standard', 'fifo'      |
| AWS_SQS_QUEUE_EMAILS_URL      | string       | `none`       | The AWS SQSQueue url to connect to in order to send emails.       |
| PROFILE_BUCKET      | string       | `user-management-profiles`       | The AWS S3 bucket name used to store profile avatar pictires.       |
| FILE_SIZE_MAX      | number       | `2097152`       | The max file size in bytes for profile avatar pictures that are to be uploaded to the specified S3 bucket.       |
| HASH_SALT_LENGTH      | number       | `10`       | The length of the hasing salt when generating passwords.       |
| REGEX_USERNAME      | string       | `/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i`       | The REGEX pattern used for username validation across all endpoints where username is used/passed.       |
| REGEX_PASSWORD      | string       | `/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/`       | The REGEX pattern used for password validation across all endpoints where password is used/passed. 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter.      |
| REGEX_FIRST_NAME      | string       | `/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i`       | The REGEX pattern used for first_name validation across all endpoints where first_name is used/passed.       |
| REGEX_LAST_NAME      | string       | `/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i`       | The REGEX pattern used for last_name validation across all endpoints where last_name is used/passed.       |
| FLAG_LOGGING_ENABLED      | boolean       | `true`       | The flag that controls whether or not the service will produce logs.       |
| FLAG_LOG_TRANSACTIONS      | boolean       | `true`       | The flag that controls whether or not the service will log out the transactions (requests/responses).       |
| FLAG_EMAILS_ENABLED      | boolean       | `true`       | The flag that controls whether or not the service will send any emails.       |
| FLAG_EMAIL_VERIFICATION_ENABLED      | boolean       | `true`       | The flag that controls whether or not the service will enforce email verification. FLAGS_EMAILS_ENABLED needs to be enabled for this flag to work.       |
| FLAG_AVATAR_ENABLED      | boolean       | `true`       | The flag that controls whether or not the service will allow new profile avatars to saved.       |
| AUTO_INITIALIZE_PROFILE      | boolean       | `true`       | If set to true, a profile will be created upon user creation, otherwise, if set to false, it will require a manual profile creation by calling the appropriate endpoint.       |
| CODE_EXPIRATION      | number       | `15`       | The length of time (in minutes) that the email/password verification codes are valid for.       |
| VERSION      | string       | `17.38`       | The version of the service returned in the /system/version endpoint.       |

## Local Development

Prerequisites:
- Npm
- Docker (3.x)

After starting up docker, at the root of the project, run `npm run start-api`. The entire stack should now be up and running, including api, mongodb, and localstack (local aws).

## Architecture

Emails:

The User-Management service sends a message to AWS SQSQueue where the messageBody is

    {
        userId: string,
        username: string,
        code: string,
        expiration: Date
    }
    
where code and expiration are optional, and the rest are required. Also, messageBodyAttributes contain the property "timestamp" which has a string value of the date at which the message was sent on. If the SQSQueue type is 'fifo', then the following proeprties are also sent: deduplicationId: messageBody.userId and messageGroupId: `email::${type}`. It is recommended for you to have a Lambda trigger listening for events in the SQSQueue to fire off an email, whether it is email via SES or a third party service.

## Upcoming Features

- Allow users to change/update their username.
- Implement cache mechanism.
- Add additional relational database option.
- Add additional cloud provider.
- Add unit tests.
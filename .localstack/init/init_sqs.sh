#!/bin/bash
set -x
awslocal --endpoint-url=http://localhost:4566 sqs create-queue --queue-name user-management-emails --region us-east-1 --attributes VisibilityTimeout=30
set +x
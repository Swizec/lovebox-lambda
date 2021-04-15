import { SecretsManager } from "aws-sdk";

const ssm = new SecretsManager({
    region: "us-east-1", // make sure this matches your region
    apiVersion: "2017-10-17",
});

export async function getBearerToken() {
    const secret = await ssm
        .getSecretValue({ SecretId: "loveboxBearerToken" })
        .promise();

    const { BEARER_TOKEN } = JSON.parse(secret?.SecretString || "");

    return BEARER_TOKEN;
}

export async function getRecipient() {
    const secret = await ssm
        .getSecretValue({ SecretId: "loveboxBearerToken" })
        .promise();

    const { DEVICE_ID, RECIPIENT } = JSON.parse(secret?.SecretString || "");

    return {
        deviceId: DEVICE_ID,
        recipient: RECIPIENT,
    };
}

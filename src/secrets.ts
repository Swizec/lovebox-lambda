import { SecretsManager } from "aws-sdk";

const ssm = new SecretsManager({
    region: "us-east-1", // make sure this matches your region
});

export async function getBearerToken() {
    const secret = await ssm
        .getSecretValue({ SecretId: "loveboxBearerToken" })
        .promise();

    const { BEARER_TOKEN } = JSON.parse(secret?.SecretString || "");
}

import { v4 as uuidv4 } from "uuid";
import { S3 } from "aws-sdk";
import { APIGatewayEvent } from "aws-lambda";

const s3 = new S3({
    apiVersion: "2006-03-01",
});

export async function getUrl(event: APIGatewayEvent) {
    const fileType = event.queryStringParameters?.filetype;

    if (!fileType?.startsWith("image")) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Please upload an image" }),
        };
    }

    // image/png -> png
    const extension = fileType.split("/")[1];

    const imageId = uuidv4();
    const filename = `${imageId}.${extension}`;
    const expireSeconds = 60 * 5;
    const readUrl = `https://lovebox-stash.s3.amazonaws.com/${filename}`;

    const uploadUrl = s3.getSignedUrl("putObject", {
        Bucket: "lovebox-stash",
        Key: filename,
        ContentType: fileType,
        Expires: expireSeconds,
    });

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "access-control-allow-methods": "GET",
    };

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            uploadUrl,
            readUrl,
            imageId,
        }),
    };
}

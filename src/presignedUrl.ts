import { v4 as uuidv4 } from "uuid";
import { S3 } from "aws-sdk";

const s3 = new S3({
    apiVersion: "2006-03-01",
});

export async function getUrl() {
    const imageId = uuidv4();
    const filename = `${imageId}`;
    const expireSeconds = 60 * 5;
    const readUrl = `https://lovebox-stash.s3.amazonaws.com/${filename}`;

    const uploadUrl = s3.getSignedUrl("putObject", {
        Bucket: "lovebox-stash",
        Key: filename,
        ContentType: "image/*",
        Expires: expireSeconds,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            uploadUrl,
            readUrl,
            imageId,
        }),
    };
}

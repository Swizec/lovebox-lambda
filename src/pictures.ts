import { S3 } from "aws-sdk";

const s3 = new S3({
    apiVersion: "2006-03-01",
});

async function listPictures() {
    const list = await s3
        .listObjects({
            Bucket: "lovebox-stash",
        })
        .promise();

    return list.Contents;
}

export async function getPicture() {
    const pictures = await listPictures();

    if (pictures) {
        const randomPic = pictures[Math.floor(Math.random() * pictures.length)];

        if (randomPic.Key) {
            const imageData = await s3
                .getObject({
                    Bucket: "lovebox-stash",
                    Key: randomPic.Key,
                })
                .promise();

            return imageData;
        }
    }

    return null;
}

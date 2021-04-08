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
    console.log("listing pictures");
    const pictures = await listPictures();

    if (pictures) {
        console.log("got pictures");

        const randomPic = pictures[Math.floor(Math.random() * pictures.length)];
        console.log(randomPic);

        if (randomPic.Key) {
            console.log("getting imageData");
            const imageData = await s3
                .getObject({
                    Bucket: "lovebox-stash",
                    Key: randomPic.Key,
                })
                .promise();
            console.log("got image");
            return imageData;
        }
    }

    return null;
}

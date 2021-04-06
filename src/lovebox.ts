import { request, gql, GraphQLClient } from "graphql-request";
import { S3 } from "aws-sdk";
import { getBearerToken } from "./secrets";
import { getPicture } from "./pictures";

let graphQLClient: null | GraphQLClient = null;

async function createGraphQLClient() {
    if (graphQLClient === null) {
        const token = await getBearerToken();

        graphQLClient = new GraphQLClient(
            "https://app-api.loveboxlove.com/v1/graphql",
            {
                headers: {
                    // TODO: figure out how to login
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    return graphQLClient;
}

async function sendPicture(picture: S3.GetObjectOutput) {
    console.log(picture.ContentType);

    const base64 = `data:${picture.ContentType};base64,${picture.Body?.toString(
        "base64"
    )}`;
    const client = await createGraphQLClient();
    const res = await client.request(
        gql`
            mutation sendPixNote(
                $base64: String
                $recipient: String
                $date: Date
                $options: JSON
                $contentType: [String]
            ) {
                sendPixNote(
                    base64: $base64
                    recipient: $recipient
                    date: $date
                    options: $options
                    contentType: $contentType
                ) {
                    _id
                    type
                    recipient
                    url
                    date
                    status {
                        label
                        __typename
                    }
                    base64
                    __typename
                }
            }
        `,
        {
            base64,
            recipient: "5ff7ef4e4d725e005bac24f0",
            contentType: ["Image"],
            options: {
                framesBase64: null,
                deviceId: "3DDA5D3B-8EF4-4F82-8634-62F245D082C2",
            },
        }
    );
    console.log(res);
}

export const sendNote = async () => {
    const picture = await getPicture();

    if (picture) {
        sendPicture(picture);
    }
};

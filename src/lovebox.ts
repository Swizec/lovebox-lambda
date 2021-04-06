import { request, gql, GraphQLClient } from "graphql-request";
import { S3 } from "aws-sdk";
import { getBearerToken, getRecipient } from "./secrets";
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
    const base64 = `data:${picture.ContentType};base64,${picture.Body?.toString(
        "base64"
    )}`;
    const client = await createGraphQLClient();
    const { recipient, deviceId } = await getRecipient();

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
            recipient,
            contentType: ["Image"],
            options: {
                framesBase64: null,
                deviceId,
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

import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

dotenv.config();

const client = new TwitterApi({
  appKey: process.env.CONSUMER_API_KEY!,
  appSecret: process.env.CONSUMER_API_SECRET!,
  accessToken: process.env.ACCESS_TOKEN!,
  accessSecret: process.env.ACCESS_TOKEN_SECRET!,
});

const rwClient = client.readWrite;

const tweet = async (message: string) => {
  try {
    await rwClient.v2.tweet(message);
    console.log("ツイートが投稿されました:", message);
  } catch (error) {
    console.error("ツイートの投稿に失敗しました:", error);
  }
};

const message = "これは自動投稿されたツイートです。";
tweet(message);

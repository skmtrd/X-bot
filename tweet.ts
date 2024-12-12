import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { ApiResponse, Assignment } from "./types";
import { parseISO, compareAsc } from "date-fns";

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
    const formattedMessage = message.replace(/\\n/g, "\n").trim();

    await rwClient.v2.tweet(message);
    console.log("ツイートが投稿されました:", message);
  } catch (error) {
    console.error("ツイートの投稿に失敗しました:", error);
  }
};

const formatDeadlineNotifications = (assignments: Assignment[]): string => {
  if (assignments.length === 0) {
    return "期限が近い課題はありません";
  }

  const header = "提出期限まで一時間を切っている課題があります\n";

  const formattedAssignments = assignments
    .map(
      (assignment, index) => `
  ${index + 1}. ${assignment.title}
  ⏰ 期限: ${assignment.deadLine}
  ────────────`
    )
    .join("\n");

  return `${header}${formattedAssignments}`.trim();
};

const formatTodayNotifications = (assignments: Assignment[]): string => {
  if (assignments.length === 0) {
    return "今日提出の課題はありません";
  }
  const header = "提出期限が今日までの課題があります\n";

  const formattedAssignments = assignments
    .map(
      (assignment, index) => `
  ${index + 1}. ${assignment.title}
  ⏰ 期限: ${assignment.deadLine}
  ────────────`
    )
    .join("\n");

  return `${header}${formattedAssignments}`.trim();
};

export const fetchAssignments = async (): Promise<Assignment[]> => {
  try {
    const response = await fetch("https://iniad-sns.vercel.app/api/assignment");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

function convertTime(dateStr: string) {
  const date = new Date(dateStr.replace("/", "T"));
  const JSTDate = new Date(date.getTime()).toISOString().replace("Z", "+09:00");

  console.log("JSTDate:", JSTDate);
  console.log("Parsed JSTDate:", parseISO(JSTDate));
  return parseISO(JSTDate);
}

const main = async () => {
  //課題情報を取得
  const assignments = await fetchAssignments();

  //現在時刻を取得
  const now = new Date();
  //一時間後の時刻を取得
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  //現在時刻から一時間後の時刻までの課題を取得
  const filteredAssignments = assignments.filter((assignment) => {
    const deadLineDate = convertTime(assignment.deadLine);
    console.log(
      "Assignment deadline:",
      assignment.title,
      deadLineDate.toISOString()
    );
    const isInRange = deadLineDate >= now && deadLineDate <= oneHourLater;
    return isInRange;
  });

  if (now.getHours() === 15) {
    const todayAssignments = assignments.filter((assignment) => {
      const deadLineDate = convertTime(assignment.deadLine);
      return (
        deadLineDate.toISOString().split("T")[0] ===
        now.toISOString().split("T")[0]
      );
    });

    if (todayAssignments.length > 0) {
      await tweet(formatTodayNotifications(todayAssignments));
    }
  }

  //もし一時間後の時刻までの課題がなかったらreturn
  if (filteredAssignments.length === 0) {
    return;
  }

  await tweet(formatDeadlineNotifications(filteredAssignments));
};

main();

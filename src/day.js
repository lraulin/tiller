import dayjs from "dayjs";

console.log(
  dayjs()
    .startOf("month")
    .add(1, "day")
    .set("year", 2018)
    .format("YYYY-MM-DD HH:mm:ss")
);

export { dayjs };

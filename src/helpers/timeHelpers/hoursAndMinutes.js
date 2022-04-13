import moment from "moment";
import i18n from "@/i18n";

export default function hoursAndMinutes(duration) {
  const dur = moment.duration(duration, "minutes").asMinutes();
  let minutes = dur % 60;
  let hours = Math.floor(dur / 60);

  return "".concat(
    hours.toString(),
    i18n.get("_.time.hours.short"),
    " ",
    minutes.toString(),
    i18n.get("_.time.minutes.short")
  );
}

import moment from "moment";

export default function fullTime(minutes, short = false) {
  const duration = moment.duration(minutes, "minutes");
  let append = "";
  if (short) {
    append = ".short";
  }

  let output = "";
  if (duration.years()) {
    output = output.concat(
      duration.years().toString(),
      this.i18n.get("_.time.years" + append),
      " "
    );
  }
  if (duration.months()) {
    output = output.concat(
      duration.months().toString(),
      this.i18n.get("_.time.months" + append),
      " "
    );
  }
  if (duration.days()) {
    output = output.concat(
      duration.days().toString(),
      this.i18n.get("_.time.days" + append),
      " "
    );
  }
  if (duration.hours()) {
    output = output.concat(
      duration.hours().toString(),
      this.i18n.get("_.time.hours" + append),
      " "
    );
  }
  if (duration.minutes()) {
    output = output.concat(
      duration.minutes().toString(),
      this.i18n.get("_.time.minutes" + append),
      " "
    );
  }

  return output;
}

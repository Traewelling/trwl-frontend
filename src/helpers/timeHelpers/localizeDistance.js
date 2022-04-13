import localizeThousands from "@/helpers/timeHelpers/localizeThousands";

export default function localizeDistance(distance) {
  return localizeThousands(distance / 1000, 1);
}

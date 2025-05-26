export const formatDate = (dateString) => {
  try {
    if (!dateString) return "";

    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/;
    const match = dateString.match(dateRegex);

    if (match) {
      const [_, day, month, year, hours, minutes] = match;
      return `${day}.${month}.${year} о ${hours}:${minutes}`;
    } else {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}.${month}.${year} о ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatDateLocale = (dateString) => {
  try {
    if (!dateString) return "";

    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/;
    const match = dateString.match(dateRegex);

    let date;
    if (match) {
      const [_, day, month, year, hours, minutes] = match;
      date = new Date(year, month - 1, day, hours, minutes);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "";

    const dateFormatted = date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeFormatted = date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${dateFormatted} о ${timeFormatted}`;
  } catch (error) {
    console.error("Error formatting date with locale:", error);
    return dateString;
  }
};

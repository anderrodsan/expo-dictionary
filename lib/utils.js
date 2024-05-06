export const formatDateLabel = (dateString) => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split("T")[0];
  const inputDate = new Date(dateString);
  const diffDays = today - inputDate;

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    // Format date to display as "DD Mon"
    const options = { day: "numeric", month: "short" };
    return inputDate.toLocaleDateString("en-GB", options);
  }
};

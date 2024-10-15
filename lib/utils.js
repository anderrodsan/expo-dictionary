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

export const getCurrentDate = () => {
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  return todayDate;
};

//check if the lastReviewed and currentDate are the same (boolean output)
export const isSameDay = (lastReviewed) => {
  const currentDate = getCurrentDate();
  if (!lastReviewed) {
    return false;
  }

  if (lastReviewed === currentDate) {
    return true;
  } else {
    return false;
  }
};

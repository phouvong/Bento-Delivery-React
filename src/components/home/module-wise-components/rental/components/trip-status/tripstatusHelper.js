export const getReachedTime = (tripDetails) => {
  const time1Date = new Date(tripDetails?.estimated_trip_end_time);

  // Get the current time as a Date object
  const currentTime = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = time1Date - currentTime;

  // Convert the difference to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

  // Check if the current time is less than 20 minutes before time1
  return differenceInMinutes > 0 && differenceInMinutes < 20;
};

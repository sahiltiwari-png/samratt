import API from "./auth";

export const getHolidayCalendar = async (organizationId: string) => {
  const res = await API.get(`/holiday/holiday-calendar/${organizationId}`);
  return res.data;
};

export const saveHolidayCalendar = async (organizationId: string, calendarFileName: string) => {
  const res = await API.post("/holiday/holiday-calendar", {
    organizationId,
    calendarFileName,
  });
  return res.data;
};

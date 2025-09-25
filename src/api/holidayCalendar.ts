import API from "./auth";


// GET /holiday/holiday-calendar/ (no orgId in URL, orgId in query or from auth)
export const getHolidayCalendar = async () => {
  const res = await API.get(`/holiday/holiday-calendar/`);
  return res.data;
};

export const saveHolidayCalendar = async (organizationId: string, calendarFileName: string) => {
  const res = await API.post("/holiday/holiday-calendar", {
    organizationId,
    calendarFileName,
  });
  return res.data;
};

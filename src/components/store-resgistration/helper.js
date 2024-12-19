export const getZoneWiseModule = (data, zoneId) => {
  const result = data?.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return zoneIds?.includes(zoneId);
  });
  return result;
};

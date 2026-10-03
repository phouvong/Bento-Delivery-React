export const isBogoCartRow = (row) => !!row?.bogo_details?.bogo_group_id;

export const getBogoDetails = (row) => row?.bogo_details ?? null;

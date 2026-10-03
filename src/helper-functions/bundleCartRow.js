export const isBundleCartRow = (row) => !!row?.bundle_details?.bundle_id;

export const getBundleDetails = (row) => row?.bundle_details ?? null;

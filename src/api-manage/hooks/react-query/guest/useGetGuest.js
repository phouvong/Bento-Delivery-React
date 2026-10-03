import React from 'react'
import { useMutation, useQuery } from 'react-query'
import MainApi from '../../../MainApi'
import { onErrorResponse } from '../../../api-error-response/ErrorResponses';
import { guest_checkout } from '../../../ApiRoutes';
import { getApiContent } from '../../../getApiContent';

const getGuest = async () => {
    const { data } = await MainApi.post(guest_checkout);
    // Callers read `guestData?.guest_id` and persist it to localStorage; the
    // id lives at content.guest_id in v4.2. Without this the guest id is never
    // stored, so every guest cart/order call goes out without it and 401s —
    // and the "create a guest if we have none" effect re-fires on each mount.
    return getApiContent(data);
}
export default function useGetGuest() {
    return useQuery("guest", getGuest, {
        enabled: false,
        onError: onErrorResponse
    });
}
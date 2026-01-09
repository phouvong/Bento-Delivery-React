import { Stack, Typography, useTheme, Button } from '@mui/material'
import React, { useState } from 'react'
import { CustomStackFullWidth } from '../../../../styled-components/CustomStyles.style';
import CustomDivider from '../../../CustomDivider';
import { t } from 'i18next';
import { ReadMore } from '../../../ReadMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from 'react-query';
import { OrderApi } from '../../../../api-manage/another-formated-api/orderApi';
import { useDispatch } from 'react-redux';
import { setClearCart } from '../../../../redux/slices/cart';
import { toast } from 'react-hot-toast';
import Router from 'next/router';
import { onErrorResponse } from '../../../../api-manage/api-error-response/ErrorResponses';
import { getGuestId } from '../../../../helper-functions/getToken';

const OfflineOrderDetails = ({ trackOrderData, setOpenOfflineModal, setOpenPaymentMethod, refetchTrackOrder }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    // Form data for API calls
    const formData = {
        order_id: trackOrderData?.id,
        _method: 'put',
        guest_id: getGuestId(),
    };

    // Mutation for switching to COD
    const { mutate: paymentMethodUpdateMutation, isLoading: switchToCODLoading } = useMutation(
        'order-payment-method-update',
        OrderApi.FailedPaymentMethodUpdate
    );

    // Success handler
    const handleSuccess = (response) => {
        toast.success(response.data.message);
        dispatch(setClearCart());
        refetchTrackOrder?.();
        Router.push('/home', undefined, { shallow: true });
    };


    // Check if offline payment is not verified and order is pending
    const showPaymentActions = trackOrderData?.offline_payment?.data?.status !== "verified" && trackOrderData?.order_status === "pending";

    return (
        <CustomStackFullWidth gap="20px" paddingTop="20px" mt="20px" backgroundColor={theme.palette.neutral[300]} paddingX="10px" pb="20px" borderRadius="10px"   >
            <Stack width="100%" >
                <Stack flexDirection="row" justifyContent='space-between' paddingBottom="5px">
                    <Typography
                        fontSize="14px"
                        fontWeight="500"
                        color={theme.palette.neutral[500]}
                    >
                        {t("Seller Payment Info")}
                    </Typography>
                    <Typography
                        fontSize="12px"
                        fontWeight="500"
                        color={theme.palette.neutral[1000]}
                    >
                        {t("Bank Info")}
                    </Typography>
                </Stack>
                {trackOrderData?.offline_payment?.method_fields?.map((item, index) => {
                    return (
                        <Stack padding="3px 0px" key={index}>
                            <Typography sx={{ fontSize: "12px", wordWrap: "break-word", textTransform: "capitalize" }}>
                                {item?.input_name.replaceAll("_", " ")}&nbsp;&nbsp;:&nbsp;&nbsp;
                                <Typography fontWeight="600" component="span" fontSize="12px">
                                    {item?.input_data.replaceAll("_", " ")}
                                </Typography>
                            </Typography>
                        </Stack>
                    )
                })
                }
            </Stack>
            <CustomDivider border="1px" />
            <Stack width="100%">
                <Stack flexDirection="row" justifyContent='space-between' paddingBottom="5px">
                    <Typography
                        fontSize="14px"
                        color={theme.palette.neutral[500]}
                        fontWeight="500"
                    >
                        {t("My Payment Info")}
                        <Typography component="span">{` ( ${trackOrderData?.offline_payment?.data?.method_name} )`}</Typography>
                    </Typography>
                    {showPaymentActions &&
                        <Typography
                            fontSize="12px"
                            fontWeight="500"
                            color={theme.palette.neutral[100]}
                            sx={{ cursor: "pointer", backgroundColor: theme.palette.primary.main, padding: "2px 5px", borderRadius: "5px" }}
                            onClick={() => setOpenOfflineModal(true)}
                        >
                            {t("Edit Info")}
                        </Typography>
                    }
                </Stack>
                {trackOrderData?.offline_payment?.input?.map((item, index) => {
                    return (
                        <Stack padding="3px 0px" key={index}>
                            <Typography sx={{ fontSize: "12px", wordWrap: "break-word", textTransform: "capitalize" }}>
                                {item?.user_input.replaceAll("_", " ")}&nbsp;&nbsp;:&nbsp;&nbsp;
                                <Typography fontWeight="600" component="span" fontSize="12px">
                                    {item?.user_data.replaceAll("_", " ")}
                                </Typography>
                            </Typography>
                        </Stack>
                    )
                })
                }
                <Stack>
                    {trackOrderData?.offline_payment?.data?.customer_note &&
                        <Typography fontSize="12px">
                            {"Note"}&nbsp;&nbsp;:&nbsp;&nbsp;
                            <Typography fontWeight="600" component="span" sx={{ fontSize: "12px", overflowWrap: "break-word", }}>
                                <ReadMore limits="110">
                                    {trackOrderData?.offline_payment?.data?.customer_note}
                                </ReadMore>
                            </Typography>
                        </Typography>
                    }
                </Stack>
            </Stack>

        </CustomStackFullWidth>
    )
}

export default OfflineOrderDetails
import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { custom_service_create_api } from "../../../ApiRoutes";

// POST /api/v1/service/custom-requests/{requestId}/bid-status
// Body: { offer_id, status: "approve" | "reject" }
const postBidStatus = async ({ requestId, offerId, status }) => {
  const { data } = await MainApi.post(
    `${custom_service_create_api}/${requestId}/bid-status`,
    { offer_id: offerId, status }
  );
  return data;
};

export default function usePostBidStatus(params) {
  return useMutation(
    "post-custom-service-bid-status",
    (input) => postBidStatus(input),
    params
  );
}

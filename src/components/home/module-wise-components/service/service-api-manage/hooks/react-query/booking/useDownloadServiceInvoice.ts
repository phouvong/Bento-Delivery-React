import { useMutation, UseMutationResult } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_booking_invoice_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";
import { t } from "i18next";

const INVOICE_TOAST_ID = "service-invoice-download";

const extractFilename = (
  contentDisposition: string | undefined,
  fallback: string,
): string => {
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition ?? "");
  return match?.[1] ?? fallback;
};

// Axios applies `responseType` to error responses too, so a JSON error body
// (e.g. 404 "Booking not found") arrives as a Blob — decode it back to JSON
// so onErrorResponse can read `error.response.data.errors`.
const normalizeBlobError = async (error: any): Promise<any> => {
  if (error?.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      error.response.data = JSON.parse(text);
    } catch {
      // Non-JSON body (unlikely) — leave as-is, onErrorResponse will no-op.
    }
  }
  return error;
};

const downloadServiceInvoice = async (bookingId: number | string): Promise<true> => {
  try {
    const response = await MainApi.get(`${service_booking_invoice_api}/${bookingId}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const filename = extractFilename(
      response.headers?.["content-disposition"],
      `ServiceBooking-Invoice-${bookingId}.pdf`,
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw await normalizeBlobError(error);
  }
};

// GET /api/v1/service/booking/invoice/{id} — works for regular bookings,
// repeat occurrences, and repeat-parent bookings; the backend decides the
// invoice `type` from the booking id, the client just streams+saves the PDF.
export default function useDownloadServiceInvoice(): UseMutationResult<
  true,
  unknown,
  number | string
> {
  return useMutation(downloadServiceInvoice, {
    onMutate: () => {
      toast.loading(t("Downloading invoice..."), { id: INVOICE_TOAST_ID });
    },
    onSuccess: () => {
      toast.success(t("Invoice downloaded"), { id: INVOICE_TOAST_ID });
    },
    onError: (error) => {
      toast.dismiss(INVOICE_TOAST_ID);
      onErrorResponse(error);
    },
  });
}

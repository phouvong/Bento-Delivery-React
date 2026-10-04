// Placeholder — real hook shipped with the Service addon.
export default function useGetServiceBookingList(..._args) {
  return {
    data: undefined,
    error: null,
    isLoading: false,
    isFetching: false,
    isFetched: false,
    isError: false,
    refetch: async (..._a) => ({}),
  };
}

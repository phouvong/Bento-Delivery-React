import { useQuery } from "react-query";
import { data_limit, wallet_transactions_list_api } from "../../ApiRoutes";
import MainApi from "../../MainApi";
import { getApiCollection } from "../../getApiContent";

const getData = async (pageParams) => {
	const { offset, type } = pageParams;
	const { data } = await MainApi.get(
		`${wallet_transactions_list_api}?offset=${offset}&limit=${data_limit}&type=${type}`
	);
	return getApiCollection(data);
};

export default function useGetWalletTransactionsList(pageParams) {
	return useQuery(
		`wallet-transactions-list-${pageParams.type}`,
		() => getData(pageParams),
		{
			enabled: false,
		}
	);
}

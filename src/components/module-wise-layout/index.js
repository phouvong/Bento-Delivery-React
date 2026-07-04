import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModules } from "redux/slices/configData";
import { setResetStoredData } from "redux/slices/storedData";
import { setSelectedModule } from "redux/slices/utils";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import HomePageComponents from "../home/HomePageComponents";
import ModuleSelect from "../module-select/ModuleSelect";
import { getModuleIdentifier, saveModuleParam } from "../../utils/moduleParamManager";

const ModuleWiseLayout = ({ configData, landingPageData, routeSection, routeCategory }) => {
	const [rerender, setRerender] = useState(false);
	const { selectedModule } = useSelector((state) => state.utilsData);
	const { data, refetch } = useGetModule();
	const dispatch = useDispatch();
	const router = useRouter();

	const isSmall = useMediaQuery("(max-width:1180px)");

	useEffect(() => {
		if (router.pathname === "/home") {
			refetch();
		}
	}, [router.pathname, refetch]);

	useEffect(() => {
		if (data?.length > 0) {
			dispatch(setModules(data));
		}
	}, [data, dispatch]);

	useEffect(() => {
		if (selectedModule) {
			handleModuleSelect();
		}
	}, [selectedModule]);

	const handleModuleSelect = () => {
		dispatch(setResetStoredData());
		setRerender((prevState) => !prevState);
	};

	const moduleSelectHandler = async (item) => {
		const moduleIdentifier = getModuleIdentifier(item);
		
		// Save module to localStorage and cookie
		saveModuleParam(item?.id, item?.slug);
		
		const { module_id: legacyModuleId, ...restQuery } = router.query;
		const nextQuery = { ...restQuery, module: moduleIdentifier };
		if (router.query.search) {
			const { search, ...restQuery } = nextQuery;
			await router.replace({ pathname: "/home", query: restQuery });
		}
		localStorage.setItem("module", JSON.stringify(item));
		dispatch(setSelectedModule(item));
		if (!router.query.search) {
			router.replace(
				{ pathname: router.pathname, query: nextQuery },
				undefined,
				{ shallow: true }
			);
		}
	};

	return (
		<CustomStackFullWidth>
			{/* ModuleSelect sidebar hidden */}
			<HomePageComponents
				key={rerender}
				configData={configData}
				landingPageData={landingPageData}
				routeSection={routeSection}
				routeCategory={routeCategory}
			/>
		</CustomStackFullWidth>
	);
};

export default React.memo(ModuleWiseLayout);

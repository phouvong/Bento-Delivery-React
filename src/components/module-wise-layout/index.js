/* eslint-disable react-hooks/exhaustive-deps */
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

const ModuleWiseLayout = ({ configData }) => {
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
		if (router.query.search) {
			await router.replace("/home");
		}
		localStorage.setItem("module", JSON.stringify(item));
		dispatch(setSelectedModule(item));
	};

	return (
		<CustomStackFullWidth>
			{!isSmall && data && data.length > 1 && !router.query.search && (
				<ModuleSelect
					moduleSelectHandler={moduleSelectHandler}
					selectedModule={selectedModule}
					data={data}
					configData={configData}
					dispatch={dispatch}
				/>
			)}
			<HomePageComponents key={rerender} configData={configData} />
		</CustomStackFullWidth>
	);
};

export default React.memo(ModuleWiseLayout);

import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { t } from "i18next";
import ClearIcon from '@mui/icons-material/Clear';

const CustomMultiSelect = ({
	touched,
	errors,
	options,
	height,
	handleChange = () => {},
	value,
	icon,
	placeholder = "Select options",
	label = "Select options",
	zoneOption,
}) => {
	const [selectedChips, setSelectedChips] = useState([]);

	useEffect(() => {
		handleChange(selectedChips);
	}, [selectedChips]);


	return (
		<Autocomplete
			multiple
			id="tags-outlined"
			options={zoneOption}
			getOptionLabel={(option) => option.label}
			filterSelectedOptions
			value={selectedChips}
			sx={{paddingY:"0px"}}
			onChange={(event, value) => setSelectedChips(value)}
			renderTags={(value, getTagProps) =>
				value?.slice(0, 3).map((option, index) => (
					<Chip
						sx={{
							height: "24px",
							pr: "3px",
              fontWeight:"400",
							backgroundColor: (theme) =>
								theme.palette.primary.main,
							color: (theme) => theme.palette.neutral[500],
							"& .MuiChip-deleteIcon": {
								color: (theme) => theme.palette.neutral[100],
							},
						}}
						key={option.label}
						label={option.label}
						deleteIcon={

								<ClearIcon sx={{width:"14px",height:"14px",fontWeight:"600"}}/>

						} // Add custom cross icon
						{...getTagProps({ index })}
					/>
				))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					label={t(label)}
					placeholder={t(placeholder)}
					error={Boolean(touched && errors)}
					helperText={touched && t(errors)}
					InputProps={{
						...params.InputProps,

						endAdornment: (
							<>
								{/* Display selected count as a chip */}
								{selectedChips.length > 3 && (
									<Chip
										label={`${selectedChips.length - 3} +`}
										color="primary"
										size="small"
										sx={{
											position: "absolute",
											right: {
												xs:"30px",
												md:"35px"
											},
											top: "50%",
											transform: "translateY(-50%)", // Vertically center the chip
											borderRadius: "16px", // Pill shape
											backgroundColor: (theme) =>
												theme.palette.primary.main,
											color: (theme) =>
												theme.palette.neutral[100], // White text
											height: "24px", // Adjust height
											padding: "0 3px", // Extra padding for pill effect
											fontSize: "13px", // Small text size
											zIndex: 10, // Ensure it appears above other content
										}}
									/>
								)}
								{params.InputProps.endAdornment}
							</>
						),
					}}
					sx={{
						"& .MuiOutlinedInput-root": {
							minHeight: height ? height : "45px", // Set desired height
							display: "flex",
							alignItems: "center", // Center content vertically
						},
						"& .MuiAutocomplete-inputRoot": {
							paddingTop:{xs:"10px",md:"0px"},
							paddingBottom:{xs:"10px",md:"0px"},
						},
						"& .MuiInputBase-input": {
							padding: "10px 6px", // Adjust padding for text
						},
						"& .MuiFormHelperText-root": {
							marginLeft: "0px",
							marginTop: "5px",
							color: (theme) => theme.palette.error.main,
						},
						"& .MuiInputBase-input::placeholder": {
							fontSize: "13px", // Set placeholder font size
						},
					}}
				/>
			)}
		/>
	);
};

export default CustomMultiSelect;

import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { CustomTextFieldContainer } from "styled-components/CustomStyles.style";
import { CustomTextFieldStyle } from "./CustomTextField.style";

const CustomTextFieldWithFormik = (props) => {
	const {
		label,
		type,
		required,
		touched,
		errors,
		value,
		fieldProps,
		multiline,
		onChangeHandler,
		rows,
		disabled,
		placeholder,
		height,
		startIcon,
		autoFocus,
		fontSize,
		maxLength,
		backgroundColor,
		labelColor,
	} = props;
	const theme = useTheme();
	const [inputValue, setInputValue] = useState(value);
	const [showPassword, setShowPassword] = useState(false);
	const onChangeHandlerForField = (e) => {
		setInputValue(e.target.value);
	};
	const onBlurHandler = () => {
		onChangeHandler(inputValue);
	};

	const renderHandler = () => {
		if (type === "password") {
			return (
				<CustomTextFieldContainer>
					<CustomTextFieldStyle
					labelColor={labelColor}
						height={height}
						backgroundColor={backgroundColor}
						disabled={disabled}
						fullWidth
						multiline={multiline}
						rows={rows ? rows : 4}
						label={label}
						name={label}
						required={required}
						error={Boolean(touched && errors)}
						helperText={touched && errors}
						value={inputValue}
						placeholder={placeholder ? placeholder : ""}
						onChange={onChangeHandlerForField}
						onBlur={onBlurHandler}
						type={showPassword ? "text" : type}
						kout
						InputProps={{
							style: {
								height: "45px",
							},
							startAdornment: startIcon,
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() =>
											setShowPassword(
												(prevState) => !prevState
											)
										}
									>
										{showPassword ? (
											<Visibility
												sx={{
													color: alpha(
														theme.palette
															.neutral[500],
														0.4
													),
												}}
											/>
										) : (
											<VisibilityOff
												sx={{
													color: alpha(
														theme.palette
															.neutral[500],
														0.4
													),
												}}
											/>
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
						{...fieldProps}
					/>
				</CustomTextFieldContainer>
			);
		} else {
			return (
				<CustomTextFieldContainer>
					<CustomTextFieldStyle
					labelColor={labelColor}
						backgroundColor={backgroundColor}
						fontSize={fontSize}
						disabled={disabled}
						autoFocus={autoFocus}
						fullWidth
						multiline={multiline}
						rows={rows ? rows : 6}
						label={label}
						placeholder={placeholder ? placeholder : ""}
						name={label}
						required={required}
						error={Boolean(touched && errors)}
						helperText={touched && errors}
						value={inputValue}
						onChange={onChangeHandlerForField}
						onBlur={onBlurHandler}
						type={type}
						height={height}
						InputProps={{
							startAdornment: startIcon,
							inputProps: { min: 0 },
							style: {
								height: height || "45px",
							},
						}}
						InputLabelProps={{
							shrink: true,
						}}
						{...fieldProps}
					/>
				</CustomTextFieldContainer>
			);
		}
	};
	return <Box sx={{ width: "100%", height: "55px" }}>{renderHandler()}</Box>;
};

export default CustomTextFieldWithFormik;

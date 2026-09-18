export const resolveContactPerson = ({
  address,
  guestUserInfo,
  profileInfo,
  token,
}) => {
  const profileFullName = [profileInfo?.f_name, profileInfo?.l_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    name:
      address?.contact_person_name ??
      (token
        ? profileFullName || profileInfo?.name
        : guestUserInfo?.contact_person_name),
    number:
      address?.contact_person_number ??
      (token ? profileInfo?.phone : guestUserInfo?.contact_person_number),
    email:
      address?.contact_person_email ??
      (token ? profileInfo?.email : guestUserInfo?.contact_person_email),
  };
};

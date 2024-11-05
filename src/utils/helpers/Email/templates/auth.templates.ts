export const accountCreated = (
  email: string,
  firstName: string,
  lastName: string
) => `
    Hello ${firstName} ${lastName} to the platform. \n
    Signed up with ${email}
`;

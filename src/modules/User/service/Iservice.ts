interface IUserService {
  getUserById(id: string): Promise<object>;
  getUserByEmail(email: string): Promise<object>;
}

export default IUserService;

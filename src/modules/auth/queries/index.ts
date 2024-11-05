interface IAuthQueries {
  insertProviderAndState: string;
  deleteFromUserState: string;
}

const authQueries: IAuthQueries = {
    insertProviderAndState: `INSERT INTO user_states (state, provider) VALUES ($1, $2);`,
    deleteFromUserState: `DELETE FROM user_states WHERE state = $1 AND provider = $2;`
};

export default authQueries;

interface IUserQueries {
  getUserById: string;
  getUserByEmail: string;
  createOauthUser: string;
}

const userQueries: IUserQueries = {
  getUserById: `SELECT id FROM users WHERE id = $1;`,
  getUserByEmail: `SELECT id FROM users WHERE email = $1;`,
  createOauthUser: `INSERT INTO users (id, email, first_name, last_name, image_url, email_verified) VALUES ($1, $2, $3, $4, $5, $6);
          UPDATE user_states SET email = $2 WHERE state = $7`,
};

export default userQueries;

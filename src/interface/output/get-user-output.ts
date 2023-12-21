export interface GetUserOutput {
  /**
   * Unique identifier for the user
   */
  id: number;

  /**
   * Email address of the user
   */
  email: string;

  /**
   * Last name of the user
   */
  lastName: string;

  /**
   * First name of the user
   */
  firstName: string;

  /**
   * Password of the user
   */
  password: string;

  /**
   * Token when user sign in the platform
   */
  token: string;
}

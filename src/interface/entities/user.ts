export interface User {
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
}

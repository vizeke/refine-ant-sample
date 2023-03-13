import { AuthProvider } from "@pankod/refine-core";

const mockUsers = [
  { email: "john@mail.com", token: "123", roles: ["admin"] },
  { email: "jane@mail.com", token: "abc", roles: ["editor"] },
];
const authProvider: AuthProvider = {
  login: ({ email, password, remember }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === email);

    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
      return Promise.resolve();
    }

    return Promise.reject();
  },
  checkAuth: () => {
    const user = localStorage.getItem("auth");

    if (user) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }

    return Promise.resolve();
  },
  getPermissions: () => {
    const user = localStorage.getItem("auth");

    if (user) {
      const { roles } = JSON.parse(user);

      return Promise.resolve(roles);
    }

    return Promise.reject();
  },
  getUserIdentity: () => {
    const user = localStorage.getItem("auth");

    if (user) {
      const { email, roles } = JSON.parse(user);

      return Promise.resolve({ email, roles });
    }

    return Promise.reject();
  },
  register: ({ email, password }) => {
    const user = mockUsers.find((user) => user.email === email);

    console.log(email, password);

    if (user) {
      return Promise.reject();
    }

    mockUsers.push({ email, token: "", roles: ["user"] });

    return Promise.resolve();
  },
  forgotPassword: ({ email }) => {
    console.log(email);
    // send password reset link to the user's email address here
    // if request is successful, resolve the Promise, otherwise reject it
    return Promise.resolve();
  },
  updatePassword: ({ password, confirmPassword }) => {
    console.log(password, confirmPassword);
    // update the user's password here
    // if request is successful, resolve the Promise, otherwise reject it
    return Promise.resolve();
  },
};

export default authProvider;

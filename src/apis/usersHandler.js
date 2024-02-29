import request from "./httpRequest.js";
export const loginAPI = ({username,password}) => {
  return request({
    url: "/login",
    method: "post",
    data:{
        username,
        password
    }
  });
};
export const registerAPI = ({username,password,email}) => {
    return request({
      url: "/register",
      method: "post",
      data:{
          username,
          password,
          email
      }
    });
  };
export const getUserListAPI = (data) => {
    return request({
      url: "/adUser",
      method: "get",
        params:data
    });
  };
export const deleteUserAPI = (data) => {
    return request({
      url: "/adUser/"+data,
      method: "delete",
    });
  };
export const updateUserAPI = (data) => {
    return request({
      url: "/adUser",
      method: "put",
        data
    });
  };
export const addUserAPI = (data) => {
    return request({
      url: "/adUser",
      method: "post",
        data
    });
  };
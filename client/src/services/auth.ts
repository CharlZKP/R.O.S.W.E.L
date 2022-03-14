import Api from "./Api";

// https://dev.to/lukocastillo/svelte-3-how-to-connect-your-app-with-a-rest-api-axios-2h4e

/*
/register

req.body.email
req.body.password
req.body.fullname


/login

req.body.email
req.body.password

req.body.login_string
*/

export async function registerUser(fullname, email, password) {
  try {
    const response = await Api.post(`/register`, {
      email,
      password,
      fullname,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function login(email, password) {
  try {
    const response = await Api.post(`/login`, {
      email,
      password,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function CMUOauthLogin(login_string) {
  try {
    const response = await Api.post(`/login/oauth/CMU/check`, {
      login_string,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function CMUOauthLoginRequest() {
  try {
    const response = await Api.get(`/login/oauth/CMU/request`);

    /*
		success
		url
		*/

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function logout() {
  try {
    const response = await Api.post(`/logout`, {});

    return response;
  } catch (error) {
    console.error(error);
  }
}

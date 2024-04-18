import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

/**
 * Authenticate user
 * @param {*} username
 * @returns
 */
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username does not exist" };
  }
}

/**
 * Get user
 * @param {*} param0
 * @returns
 */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`, { username });
    return { data };
  } catch (error) {
    return { error: "Password does not match" };
  }
}

/**
 * Register User function
 */
export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);
    let { username, email } = credentials;
    /**send the email */
    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**
 * Login
 * @param {*} param0
 * @returns
 */
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

/**Update User Profile */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile" });
  }
}

/**
 * generate OTP
 */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("api/generateOTP", { params: { username } });
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and Recover your Password...!`;
      await axios.post("api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**
 * VerifyOTP
 */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error: "Username does not exist" });
  }
}

/**
 * Reset Password
 */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
/**
 * Upvote a question
 * @param {string} qid - Question ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteQuestion(qid) {
  try {
    const response = await axios.put(`/api/questions/${qid}/upvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote a question
 * @param {string} qid - Question ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteQuestion(qid) {
  try {
    const response = await axios.put(`/api/questions/${qid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Upvote an answer
 * @param {string} aid - Answer ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteAnswer(aid) {
  try {
    const response = await axios.put(`/api/answers/${aid}/upvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote an answer
 * @param {string} aid - Answer ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteAnswer(aid) {
  try {
    const response = await axios.put(`/api/answers/${aid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Upvote a comment
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteComment(cid) {
  try {
    const response = await axios.put(`/api/comments/${cid}/upvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote a comment
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteComment(cid) {
  try {
    const response = await axios.put(`/api/comments/${cid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Add a comment to an answer
 * @param {string} aid - Answer ID
 * @param {string} text - Comment text
 * @param {string} posted_by - Posted by
 * @returns {Promise<AxiosResponse>}
 */
export async function addCommentToAnswer(aid, text, posted_by) {
  try {
    const response = await axios.post(`/api/answers/${aid}/comments`, {
      text,
      posted_by,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Delete a comment from an answer
 * @param {string} aid - Answer ID
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteCommentFromAnswer(aid, cid) {
  try {
    const response = await axios.delete(`/api/answers/${aid}/comments/${cid}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Add a comment to a question
 * @param {string} qid - Question ID
 * @param {string} text - Comment text
 * @param {string} posted_by - Posted by
 * @returns {Promise<AxiosResponse>}
 */
export async function addCommentToQuestion(qid, text, posted_by) {
  try {
    const response = await axios.post(`/api/questions/${qid}/comments`, {
      text,
      posted_by,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Delete a comment from a question
 * @param {string} qid - Question ID
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteCommentFromQuestion(qid, cid) {
  try {
    const response = await axios.delete(
      `/api/questions/${qid}/comments/${cid}`
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

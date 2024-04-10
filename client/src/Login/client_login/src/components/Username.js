import React from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import '../Stylesheet/Username.css';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate, passwordValidate } from '../validation/validate';

export default function Username() {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validate: values => {
      const errors = {};
      usernameValidate(errors, values);
      passwordValidate(errors, values);
      return errors;
    },

    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
    console.log(values);
    }
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formik.values.username && !formik.values.password) {
      return toast.error('Please enter username and password.');
    }
    if (!formik.values.username) {
      return toast.error('Please enter username.');
    }
    if (!formik.values.password) {
      return toast.error('Please enter password.');
    }
    formik.handleSubmit();
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className="glass">
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold pt-4">LOG IN</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Please Login with your Credentials.
            </span>
          </div>
          <form className="py-1" onSubmit={handleFormSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className="profile_img" alt="avatar" />
            </div>
            <div className="main_working_box">
              <input
                {...formik.getFieldProps('username')}
                type="text"
                placeholder="Username"
                className="textbox"
              />
              <input
                {...formik.getFieldProps('password')}
                type="password"
                placeholder="Password"
                className="textbox"
              />
              <button type="submit" className="btn">
                Login
              </button>
            </div>
            <div className="text-center py-4">
              <div className="forgot_password_new_user">
                <div className="text-gray-500">
                  Forgot Password?{' '}
                  <Link className="text-red-500" to="/recovery">
                    Recover Password
                  </Link>
                </div>
                <div className="text-gray-500">
                  First Time User?{' '}
                  <Link className="text-red-500" to="/register">
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

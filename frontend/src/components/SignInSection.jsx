import React, { useState } from 'react';

const SignInSection = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSwitch = () => {
    setIsSignIn(!isSignIn);
    setPassword('');
    setConfirmPassword('');
    setPasswordMismatch(false);
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
      // Handle successful signup
      alert('Sign Up Successful');
    }
  };

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-2">
        
        {/* Component */}
        <div className="flex flex-col items-center justify-center bg-[#f2f2f7]">
          <div className="max-w-lg px-5 py-16 md:px-10 md:py-24 lg:py-32">
            <div className="mb-6 ml-2 flex h-14 w-14 items-center justify-center bg-[#276ef1] [box-shadow:rgb(171,_196,_245)_-8px_8px]">
              <img
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f5ec37c8c32b17d1c725_Vector-9.svg"
                alt=""
                className="inline-block"
              />
            </div>
            <p className="mb-8 text-[#647084] md:mb-12 lg:mb-16">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
              purus sit amet luctus venenatis, lectus magna fringilla urna,
              porttitor rhoncus dolor purus non enim.
            </p>
            <p className="font-bold">John Robert</p>
            <p className="text-sm">Senior Webflow Developer</p>
          </div>
        </div>
        
        {/* Form Container */}
        <div className="flex flex-col items-center justify-center bg-white">
          <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
            {/* Title */}
            <h2 className="mb-8 text-2xl w-full font-bold md:mb-12 md:text-5xl">
              {isSignIn ? 'Welcome back Login' : 'Create your account'}
            </h2>
            {/* Form */}
            {isSignIn ? (
              <form
                className="mx-auto mb-4 max-w-sm pb-4"
                name="wf-form-signin"
                method="get"
              >
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="email"
                    className="block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded"
                    maxLength="256"
                    name="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="password"
                    className="block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded"
                    placeholder="Password (min 8 characters)"
                    required
                  />
                </div>
                <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
                  <input type="checkbox" name="checkbox" />
                  <span className="ml-4 inline-block cursor-pointer text-sm">
                    I agree with the{" "}
                    <a href="#" className="font-bold text-[#0b0b1f]">
                      Terms &amp; Conditions
                    </a>
                  </span>
                </label>
                <a
                  href="#"
                  className="flex items-center justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px] rounded"
                >
                  <p className="mr-6 font-bold">Join Flowspark</p>
                  <svg
                    className="h-4 w-4 flex-none"
                    fill="currentColor"
                    viewBox="0 0 20 21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Arrow Right</title>
                    <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                  </svg>
                </a>
              </form>
            ) : (
              <form
                className="mx-auto mb-4 max-w-sm pb-4"
                name="wf-form-signup"
                method="post"
                onSubmit={handleSignUpSubmit}
              >
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="name"
                    className="block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded"
                    maxLength="256"
                    name="name"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="email"
                    className="block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded"
                    maxLength="256"
                    name="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="password"
                    className="block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative mb-4">
                <img
                    alt=""
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="password"
                    className={`block h-12 w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333] rounded ${passwordMismatch ? 'border-red-500' : ''}`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordMismatch && (
                  <p className="text-red-500 text-sm mb-4">
                    Passwords do not match.
                  </p>
                )}
                <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
                  <input type="checkbox" name="checkbox" />
                  <span className="ml-4 inline-block cursor-pointer text-sm">
                    I agree with the{" "}
                    <a href="#" className="font-bold text-[#0b0b1f]">
                      Terms &amp; Conditions
                    </a>
                  </span>
                </label>
                <a
                  href="#"
                  className="flex items-center justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px] rounded"
                >
                  <p className="mr-6 font-bold">Sign Up</p>
                  <svg
                    className="h-4 w-4 flex-none"
                    fill="currentColor"
                    viewBox="0 0 20 21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Arrow Right</title>
                    <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                  </svg>
                </a>
              </form>
            )}
            {/* Toggle Button */}
            <p className="text-sm text-[#636262] mt-4">
              {isSignIn ? (
                <>
                  Already have an account?{" "}
                  <button onClick={handleSwitch} className="text-sm font-bold text-black">
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={handleSwitch} className="text-sm font-bold text-black">
                    Login now
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInSection;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

const OTPModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setError("");

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = otpValues.join("");
    
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const sessionId = await verifySecret({ 
        accountId, 
        password: otp 
      });

      if (sessionId) {
        setIsOpen(false);
        router.push("/");
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");
    
    try {
      await sendEmailOTP({ email });
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (digits.length === 6) {
      const newOtpValues = digits.split("");
      setOtpValues(newOtpValues);
      inputRefs.current[5]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-backdrop">
      <div className="otp-modal">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Animated Icon */}
          <div className="otp-icon">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--dark-100)' }}>
            Enter Your OTP
          </h2>
          
          {/* Subtitle */}
          <p className="mb-8" style={{ color: 'var(--light-100)' }}>
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-brand">{email}</span>
          </p>

          {/* OTP Input Fields */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${value ? 'filled' : ''} ${error ? 'error' : ''}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="otp-error-message mb-6">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || otpValues.some(val => !val)}
            className="otp-submit-btn mb-6"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend Section */}
          <div className="pt-6 border-t border-light-300">
            <p className="text-sm mb-3" style={{ color: 'var(--light-100)' }}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={isResending || isLoading}
              className="otp-resend-btn"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin mr-2" />
                  Resending...
                </>
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
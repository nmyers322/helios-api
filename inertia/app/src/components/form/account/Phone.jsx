import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import ErrorText from "../main/ErrorText";
import theme from "../../../modules/theme";
import { validateVisiblePhoneInput } from "../../../modules/accountValidation";
import { FormInputContainer } from "../../../styles/Form";

const phoneName = "phone";
const phoneLabel = "Phone Number";

const injectCSS = (currentTheme) => {
    const style = document.createElement('style');
    style.innerHTML = `
        .react-tel-input .form-control {
            width: 100%;
            border-radius: 0;
            margin-top: .1rem;
            background-color: ${theme[currentTheme].colors.input.background};
            color: ${theme[currentTheme].colors.input.text};
            letter-spacing: .1rem;
        }

        .react-tel-input .special-label {
            margin-top: .8rem;
            user-select: none;
            -webkit-user-select: none;
            font-family: 'Trebuchet MS', sans-serif;
            font-size: .8rem;
            left: .3rem;
            background-color: ${theme[currentTheme].colors.input.background};
            color: ${theme[currentTheme].colors.input.text};
        }

        .form-control.invalid-number {
            border-color: red;
        }

        .form-control.invalid-number:focus {
            box-shadow: 0 0 5px red;
        }

        .react-tel-input .selected-flag .arrow.up {
            border-bottom: 4px solid ${theme[currentTheme].colors.input.text};
        }

        .react-tel-input .selected-flag .arrow {
            border-top: 4px solid ${theme[currentTheme].colors.input.text};
        }

        .react-tel-input .selected-flag:focus .arrow {
            border-top: 4px solid ${theme[currentTheme].colors.primary};
        }
    `;
    document.head.appendChild(style);
};

const Phone = () => {
  const addressForm = useSelector((state) => state.billingAddressForm);
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const [cachedCurrentTheme, setCachedCurrentTheme] = useState(null);
  let [beenBlurred, setBeenBlurred] = useState(false);

  useEffect(() => {
    if (!cachedCurrentTheme || cachedCurrentTheme !== currentTheme) {
        injectCSS(currentTheme);
        setCachedCurrentTheme(currentTheme);
    }
  }, [cachedCurrentTheme, currentTheme]);

  return (
    <FormInputContainer>
        <PhoneInput
            country={'us'}
            inputProps={{
                style: {
                    padding: "1.1rem 1rem 0.8rem 4.5rem",
                    fontFamily: theme[currentTheme].fonts.base,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    letterSpacing: ".1rem",
                }
            }}
            isValid={(value, country) => {
                if (!beenBlurred) {
                    return true;
                }
                if (!value) {
                    return false;
                }
                const counter = s => [...s].reduce((a, c) => (a[c] = ++a[c] || 1) && a, {});
                if (!!value && value.length >= counter(country.format)["."]) {
                    return true;
                }
                return false;
            }}
            onBlur={() => setBeenBlurred(true)}
            onChange={(value) => {
                dispatch(updateBillingAddressFormField(phoneName, value));
            }
            }
            value={addressForm[phoneName]}
        />
        { beenBlurred && !validateVisiblePhoneInput().isValid && <ErrorText text={validateVisiblePhoneInput().errorMsg} /> }
    </FormInputContainer>
    
  );
};

export default Phone;

export { phoneName, phoneLabel };

export const checkRequired = (inputArr,inputClassName) => {
  let isRequired = false;
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${input.previousSibling.innerText} is required`,inputClassName);
      isRequired = true;
    } else {
      showSuccess(input,inputClassName);
    }
  });
  return isRequired;
};
export const checkLength = (input, min,inputClassName) => {
  let isAlready = false;
  if (input.value.length < min) {
    showError(
      input,
      `${input.previousSibling.innerText} must be at least ${min} characters`,inputClassName
    );
    isAlready = true;
  } else {
    showSuccess(input,inputClassName);
  }
  return isAlready;
};
export const checkNumber = (input, min,inputClassName) => {
  let isAlready = false;
  if (input.valueAsNumber < min) {
    showError(
      input,
      `${input.previousSibling.innerText} must be at least ${min} VND`,inputClassName
    );
    isAlready = true;
  } else {
    showSuccess(input,inputClassName);
  }
  return isAlready;
};
export const showError = (input, message,inputClassName) => {
  input.parentElement.className = `${inputClassName} error`;
  input.nextSibling.nextSibling.innerText = message;
};

export const showSuccess = (input,inputClassName) => {
  input.parentElement.className = `${inputClassName} success`;
  input.nextSibling.nextSibling.innerText = "";
};
export const checkRequiredLogin = (inputArr,inputClassName) => {
      let isRequired = false;
      inputArr.forEach((input) => {
        if (input.value.trim() === "") {
          showError(input, `${input.placeholder} is required`,inputClassName);
          isRequired = true;
        } else {
          showSuccess(input,inputClassName);
        }
      });
      return isRequired;
    };
export const checkLengthLogin = (input, min,inputClassName) => {
      let isAlready = false;
      if (input.value.length < min) {
        showError(
          input,
          `${input.placeholder} must be at least ${min} characters`,inputClassName
        );
        isAlready = true;
      } else {
        showSuccess(input,inputClassName);
      }
      return isAlready;
    };
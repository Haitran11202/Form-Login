function Validator(options) {
    var formElement = document.querySelector(options.form);

    if (formElement) {
        var selectorRules = {};
        //Thực thi kiểm tra điều kiện
        function doing(rule, inputElement) {

            var rules = selectorRules[rule.selector];
            var formMessage = inputElement.parentElement.querySelector(options.errorMessage);
            for (var i = 0; i < rules.length; i++) {
                var errorMessage = rules[i](inputElement.value);
                if (errorMessage) break;
            }

            if (errorMessage) {
                inputElement.parentElement.classList.add('invalid');
                formMessage.innerHTML = errorMessage;
            }
            else {
                inputElement.parentElement.classList.remove('invalid');
                formMessage.innerHTML = "";
            }

            var formMessage = inputElement.parentElement.querySelector(options.errorMessage);
            if (inputElement.value != "") {
                inputElement.parentElement.classList.remove('invalid');
                formMessage.innerHTML = "";
            }
            return !errorMessage;
        }

        //bỏ đi hành động khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isformvalid = true;
            //lặp qua từng rules và validator
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = doing(rule, inputElement);
                if (!isValid) {
                    isformvalid = false;
                }
            });
            if (isformvalid) {
                if (typeof options.onsubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInput).reduce(function (value, input) {
                        value[input.name] = input.value;
                        return value;
                    }, {});
                    options.onsubmit(formValues);
                }
            } else {
                console.log('có lỗi');
            }
        }
        //lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule) {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            const inputElement = document.querySelector(rule.selector);


            //Kiểm tra blur input
            inputElement.onblur = function () {

                doing(rule, inputElement);

            }
            //kiểm tra nhập input
            inputElement.oninput = function () {
                doing(rule, inputElement);
            }
        })
        console.log(selectorRules);
    }

}
//method kiểm tra thông tin nhập của người dùng 
Validator.required = function (selector, messages) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : messages || 'Vui lòng nhập trường này';
        }
    }
}
Validator.email = function (selector, messages) {
    return {
        selector: selector,
        test: function (value) {
            var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
            return isEmail ? undefined : messages || 'Vui lòng nhập đúng định dạng email';
        }
    }
}
Validator.password = function (selector, messages) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : messages || 'Mật khẩu không hợp lệ';
        }
    }
}
Validator.minLength = function (selector, min, messages) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : messages || 'Mật khẩu không khả thi';
        }
    }
}
Validator.repeatPassword = function (selector, repeat, messages) {
    return {
        selector: selector,
        test: function (value) {
            return value === repeat() && value ? undefined : messages || 'Giá trị không hợp lệ';
        }
    }
}
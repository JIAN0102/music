import {
  Form as VForm,
  Field as VField,
  ErrorMessage,
  defineRule,
} from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VForm', VForm);
    app.component('VField', VField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
  },
};

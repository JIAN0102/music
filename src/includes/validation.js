import {
  Form as VForm,
  Field as VField,
  ErrorMessage,
  defineRule,
  configure,
} from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VForm', VForm);
    app.component('VField', VField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('password_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `${context.field}為必填`,
          min: `${context.field}太短`,
          max: `${context.field}太長`,
          alpha_spaces: `${context.field}只能包含英文及空格`,
          email: `${context.field}必須為有效的電子郵件`,
          min_value: `${context.field}太小`,
          max_value: `${context.field}太大`,
          password_mismatch: '再次輸入的密碼不相同',
          excluded: `不允許使用${context.field}`,
          country_excluded: '由於政策的關係，我們不允許來自這個地區的使用者',
          tos: '您必須接受服務條款',
        };

        return messages[context.rule.name]
          ? messages[context.rule.name]
          : `${context.field}無效`;
      },
    });
  },
};

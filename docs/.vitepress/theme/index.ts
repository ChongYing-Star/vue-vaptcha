import DefaultTheme from 'vitepress/theme';
import './theme.css';
import { VaptchaButton, VaptchaPanel } from '../../../packages/index';
import { AfterLibLoaded } from '../../utils';

export default <typeof DefaultTheme>{
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('VaptchaButton', VaptchaButton);
    ctx.app.component('VaptchaPanel', VaptchaPanel);
    ctx.app.component('AfterLibLoaded', AfterLibLoaded);
  },
};

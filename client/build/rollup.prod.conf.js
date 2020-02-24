import baseConf from './rollup.base.conf';
import { merge } from 'lodash';
import { uglify } from 'rollup-plugin-uglify';

const prodConf = merge(baseConf, {
  plugins: [
    uglify({
      compress: {
        drop_console: true,
      }
    }),
  ]
});

export default prodConf;

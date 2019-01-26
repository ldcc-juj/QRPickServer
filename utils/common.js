const _ = require('lodash');
const config = require('../config');

const Common = (function (){
  return {
    imagesTypeCheck: async function (images) {
      try{
        const result = await go(images,
          logf,
          every(v => ['JPG', 'JPEG', 'PNG', 'jpg', 'jpeg', 'png']
            .includes(
              last(v.name.split('.'))
            )
          )
        ) ? images : false;
        if (result) { 
          return images 
        } else { 
          throw new Error("Wrong Image Type") 
        }
      }
      catch (e) { throw e }
    },
    parameterFormCheck: curry((param, form) => (Object.keys(form).length === 0) ? true : isMatch(Object.keys(param), Object.keys(form))),
    getUrl: (originalUrl) => first(originalUrl.split('?')),
    convertStringToArray: arg => arg instanceof Array ? arg : JSON.parse(arg),
    objectCompare: ( x, y ) => {
      if ( x === y ) return true;
      if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      if ( x.constructor !== y.constructor ) return false;
      for ( let p in x ) {
        if ( ! x.hasOwnProperty( p ) ) continue;
        if ( ! y.hasOwnProperty( p ) ) return false;
        if ( x[ p ] === y[ p ] ) continue;
        if ( typeof( x[ p ] ) !== "object" ) return false;
        if ( ! Common.objectCompare( x[ p ],  y[ p ] ) ) return false;
      }
      for ( p in y ) { if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false; }
      return true;
    }
  }
})();

module.exports = Common;